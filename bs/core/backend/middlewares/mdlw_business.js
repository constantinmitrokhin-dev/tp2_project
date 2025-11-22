
const {
	core_svc_business_find_by_id,
	core_svc_business_find_by_url_name,
	core_svc_business_create
} = require('../services/svc_CoreBusiness');
const {
	MDLW_ERR_BUSINESS_ID_NOT_FOUND,
	MDLW_ERR_BUSINESS_ALREADY_EXISTS,
	MDLW_ERR_BUSINESS_CREATION_FAILED,
	MDLW_ERR_BUSINESS_MISSING_FIELDS,
	MDLW_ERR_URL_NAME_IN_USE
} = require('./utils/msgs_error');


///* ===============================================
//*  FUNCIONES AUXILIARES REUTILIZABLES
///* ===============================================

const validateRequiredFields = (businessData, requiredFields) => {
	return requiredFields.every(field => {
		const value = businessData[field];
		return value !== undefined && value !== null && value !== '';
	});
};

const checkBusinessExists = async (url_name) => {
	const existingBusiness = await core_svc_business_find_by_url_name(url_name);
	return !!existingBusiness;
};

const createBusiness = async ({ country_id, fiscal_code, url_name, trade_name, register_name }) => {
	const newBusiness = await core_svc_business_create(
		country_id,
		fiscal_code,
		url_name,
		trade_name,
		register_name
	);

	if (!newBusiness) {
		throw new Error(MDLW_ERR_BUSINESS_CREATION_FAILED);
	}

	return newBusiness;
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


///* ===============================================
//*  MIDDLEWARES
///* ===============================================

/**
 * Middleware: Valida que el negocio exista por ID
 */
const core_mdlw_validate_business_id = async (req, res, next) => {
	try {
		const business = await core_svc_business_find_by_id(req.validatedId);
		if (!business) {
			return res.status(404).json({
				status: 404,
				message: MDLW_ERR_BUSINESS_ID_NOT_FOUND
			});
		}
		req.business = business;
		next();
	} catch (error) {
		next(error);
	}
};


/**
 * Middleware: Busca negocio por url_name
 */
const core_mdlw_get_business_by_url_name = async (req, res, next) => {
	try {
		const { url_name } = req.query;

		if (!url_name) {
			return res.status(400).json({
				status: 400,
				message: 'URL name is required'
			});
		}

		const business = await core_svc_business_find_by_url_name(url_name);
		
		if (!business) {
			return res.status(404).json({
				status: 404,
				message: MDLW_ERR_BUSINESS_ID_NOT_FOUND
			});
		}
		
		req.business = business;
		next();
	} catch (error) {
		next(error);
	}
};


///* ===============================================
//*  MIDDLEWARES DE REGISTRO
///* ===============================================

/**
 * Middleware: Registra un nuevo negocio
 */
const core_mdlw_register_business = async (req, res, next) => {
	try {
		// Validar campos requeridos
		const requiredFields = ['country_id', 'fiscal_code', 'url_name', 'trade_name', 'register_name'];
		if (!validateRequiredFields(req.body, requiredFields)) {
			return res.status(400).json({
				status: 400,
				message: MDLW_ERR_BUSINESS_MISSING_FIELDS
			});
		}

		// Verificar que el negocio no exista (por url_name)
		const { url_name } = req.body;
		const businessExists = await checkBusinessExists(url_name);
		if (businessExists) {
			return res.status(409).json({
				status: 409,
				message: MDLW_ERR_BUSINESS_ALREADY_EXISTS
			});
		}

		// Crear el negocio
		const { country_id, fiscal_code, trade_name, register_name } = req.body;
		const newBusiness = await createBusiness({
			country_id,
			fiscal_code,
			url_name,
			trade_name,
			register_name
		});

		// Adjuntar el negocio creado al request
		req.registeredBusiness = newBusiness;
		next();
	} catch (error) {
		const sequelizeError = handleSequelizeError(error);
		
		if (sequelizeError) {
			return res.status(sequelizeError.status).json(sequelizeError);
		}
		
		if (error.message === MDLW_ERR_BUSINESS_CREATION_FAILED) {
			return res.status(500).json({
				status: 500,
				message: error.message
			});
		}
		
		next(error);
	}
};


module.exports = {
	// Middlewares principales
	core_mdlw_validate_business_id,
	core_mdlw_get_business_by_url_name,
	core_mdlw_register_business,
	
	// Funciones auxiliares (reutilizables)
	validateRequiredFields,
	checkBusinessExists,
	createBusiness,
	handleSequelizeError
};


