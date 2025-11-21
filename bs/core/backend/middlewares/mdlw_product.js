
const {
	core_svc_product_find_by_id,
	core_svc_product_find_by_text,
	core_svc_product_find_by_name,
	core_svc_product_find_by_business_id_and_date,
	core_svc_product_create,
	core_svc_product_update,
	core_svc_product_delete
} = require('../services/svc_CoreProduct');
const {
	MDLW_ERR_PRODUCT_ID_NOT_FOUND,
	MDLW_ERR_PRODUCT_ALREADY_EXISTS,
	MDLW_ERR_PRODUCT_CREATION_FAILED,
	MDLW_ERR_PRODUCT_MISSING_FIELDS,
	MDLW_ERR_PRODUCT_UPDATE_FAILED,
	MDLW_ERR_PRODUCT_DELETE_FAILED,
	MDLW_ERR_PRODUCTS_NOT_FOUND,
	MDLW_ERR_BUSINESS_ID_REQUIRED,
	MDLW_ERR_NO_UPDATE_DATA
} = require('./utils/msgs_error');


///* ===============================================
//*  FUNCIONES AUXILIARES REUTILIZABLES
///* ===============================================

const validateRequiredFields = (productData, requiredFields) => {
	return requiredFields.every(field => {
		const value = productData[field];
		return value !== undefined && value !== null && value !== '';
	});
};

const checkProductExists = async (business_id, type_id, name) => {
	const existingProduct = await core_svc_product_find_by_name(business_id, type_id, name);
	return !!existingProduct;
};

const createProduct = async ({ type_id, business_id, name, valid_until, code, description, price }) => {
	const newProduct = await core_svc_product_create(
		type_id,
		business_id,
		name,
		valid_until || null,
		code || null,
		description || null,
		price || null
	);

	if (!newProduct) {
		throw new Error(MDLW_ERR_PRODUCT_CREATION_FAILED);
	}

	return newProduct;
};

const handleSequelizeError = (error) => {
	if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
		return {
			status: 400,
			message: error.errors ? error.errors.map(e => e.message).join(', ') : error.message
		};
	}
	return null;
};

const getUpdatableFields = (bodyData) => {
	const allowedFields = ['name', 'code', 'description', 'price', 'valid_until', 'type_id'];
	const updatableData = {};
	
	allowedFields.forEach(field => {
		if (bodyData[field] !== undefined) {
			updatableData[field] = bodyData[field];
		}
	});
	 
	return updatableData;
};

const updateProductData = async (product, updateData) => {
	Object.keys(updateData).forEach(key => {
		product[key] = updateData[key];
	});
	
	return await core_svc_product_update(product);
};


///* ===============================================
//*  MIDDLEWARES
///* ===============================================

/**
 * Middleware: Valida que el producto exista por ID
 */
const core_mdlw_validate_product_id = async (req, res, next) => {
	try {
		const product = await core_svc_product_find_by_id(req.validatedId);
		if (!product) {
			return res.status(404).json({
				status: 404,
				message: MDLW_ERR_PRODUCT_ID_NOT_FOUND
			});
		}
		req.product = product;
		next();
	} catch (error) {
		next(error);
	}
};


/**
 * Middleware: Obtiene todos los productos de un negocio
 */
const core_mdlw_get_products_by_business = async (req, res, next) => {
	try {
		const { business_id } = req.query;

		if (!business_id) {
			return res.status(400).json({
				status: 400,
				message: MDLW_ERR_BUSINESS_ID_REQUIRED
			});
		}

		const products = await core_svc_product_find_by_business_id_and_date(business_id);
		
		if (!products || products.length === 0) {
			return res.status(404).json({
				status: 404,
				message: MDLW_ERR_PRODUCTS_NOT_FOUND
			});
		}
		
		req.products = products;
		next();
	} catch (error) {
		next(error);
	}
};


/**
 * Middleware: Busca productos por texto
 */
const core_mdlw_get_products_by_text = async (req, res, next) => {
	try {
		const { business_id, text } = req.query;

		if (!business_id) {
			return res.status(400).json({
				status: 400,
				message: MDLW_ERR_BUSINESS_ID_REQUIRED
			});
		}

		const products = await core_svc_product_find_by_text(business_id, text);
		
		if (!products || products.length === 0) {
			return res.status(404).json({
				status: 404,
				message: MDLW_ERR_PRODUCTS_NOT_FOUND
			});
		}
		
		req.products = products;
		next();
	} catch (error) {
		next(error);
	}
};


/**
 * Middleware: Busca producto por nombre exacto
 */
const core_mdlw_get_product_by_name = async (req, res, next) => {
	try {
		const { business_id, type_id, name } = req.query;

		if (!business_id) {
			return res.status(400).json({
				status: 400,
				message: MDLW_ERR_BUSINESS_ID_REQUIRED
			});
		}

		const product = await core_svc_product_find_by_name(business_id, type_id, name);
		
		if (!product) {
			return res.status(404).json({
				status: 404,
				message: MDLW_ERR_PRODUCT_ID_NOT_FOUND
			});
		}
		
		req.product = product;
		next();
	} catch (error) {
		next(error);
	}
};


///* ===============================================
//*  MIDDLEWARES DE CREACIÓN
///* ===============================================

/**
 * Middleware: Crea un nuevo producto
 */
const core_mdlw_create_product = async (req, res, next) => {
	try {
		// Validar campos requeridos
		const requiredFields = ['type_id', 'business_id', 'name'];
		if (!validateRequiredFields(req.body, requiredFields)) {
			return res.status(400).json({
				status: 400,
				message: MDLW_ERR_PRODUCT_MISSING_FIELDS
			});
		}

		// Verificar que el producto no exista
		const { type_id, business_id, name } = req.body;
		const productExists = await checkProductExists(business_id, type_id, name);
		if (productExists) {
			return res.status(409).json({
				status: 409,
				message: MDLW_ERR_PRODUCT_ALREADY_EXISTS
			});
		}

		// Crear el producto
		const { valid_until, code, description, price } = req.body;
		const newProduct = await createProduct({
			type_id,
			business_id,
			name,
			valid_until,
			code,
			description,
			price
		});

		// Adjuntar el producto creado al request
		req.createdProduct = newProduct;
		next();
	} catch (error) {
		const sequelizeError = handleSequelizeError(error);
		
		if (sequelizeError) {
			return res.status(sequelizeError.status).json(sequelizeError);
		}
		
		if (error.message === MDLW_ERR_PRODUCT_CREATION_FAILED) {
			return res.status(500).json({
				status: 500,
				message: error.message
			});
		}
		
		next(error);
	}
};


///* ===============================================
//*  MIDDLEWARES DE ACTUALIZACIÓN
///* ===============================================

/**
 * Middleware: Actualiza un producto existente
 */
const core_mdlw_update_product = async (req, res, next) => {
	try {
		// Validar que haya datos para actualizar
		const updatableData = getUpdatableFields(req.body);
		
		if (Object.keys(updatableData).length === 0) {
			return res.status(400).json({
				status: 400,
				message: MDLW_ERR_NO_UPDATE_DATA
			});
		}

		// Si se está actualizando el nombre, verificar que no exista otro producto con ese nombre
		if (updatableData.name) {
			const { name, type_id } = updatableData;
			const productTypeId = type_id || req.product.type_id;
			
			const existingProduct = await core_svc_product_find_by_name(
				req.product.business_id,
				productTypeId,
				name
			);
			
			if (existingProduct && existingProduct.id !== req.product.id) {
				return res.status(409).json({
					status: 409,
					message: MDLW_ERR_PRODUCT_ALREADY_EXISTS
				});
			}
		}

		// Actualizar datos del producto
		const updatedProduct = await updateProductData(req.product, updatableData);
		
		if (!updatedProduct) {
			return res.status(500).json({
				status: 500,
				message: MDLW_ERR_PRODUCT_UPDATE_FAILED
			});
		}

		req.updatedProduct = updatedProduct;
		next();
	} catch (error) {
		const sequelizeError = handleSequelizeError(error);
		
		if (sequelizeError) {
			return res.status(sequelizeError.status).json(sequelizeError);
		}
		
		if (error.message === MDLW_ERR_PRODUCT_UPDATE_FAILED) {
			return res.status(500).json({
				status: 500,
				message: error.message
			});
		}
		
		next(error);
	}
};


///* ===============================================
//*  MIDDLEWARES DE ELIMINACIÓN
///* ===============================================

/**
 * Middleware: Elimina un producto (soft delete)
 */
const core_mdlw_delete_product = async (req, res, next) => {
	try {
		const deletedProduct = await core_svc_product_delete(req.product);
		
		if (!deletedProduct) {
			return res.status(500).json({
				status: 500,
				message: MDLW_ERR_PRODUCT_DELETE_FAILED
			});
		}

		req.deletedProduct = deletedProduct;
		next();
	} catch (error) {
		next(error);
	}
};


module.exports = {
	// Middlewares principales
	core_mdlw_validate_product_id,
	core_mdlw_get_products_by_business,
	core_mdlw_get_products_by_text,
	core_mdlw_get_product_by_name,
	core_mdlw_create_product,
	core_mdlw_update_product,
	core_mdlw_delete_product,
	
	// Funciones auxiliares (reutilizables)
	validateRequiredFields,
	checkProductExists,
	createProduct,
	handleSequelizeError,
	getUpdatableFields,
	updateProductData
};


