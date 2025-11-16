
///* ===============================================
//*  CONTROLADORES DE BUSINESS
//* ===============================================

/**
 * Controlador: Responde con el business registrado exitosamente
 */
const ctrl_business_register = (req, res) => {
	res.status(201).json({
		status: 201,
		message: `Business created successfully: ${req.registeredBusiness.trade_name}`,
		data: {
			id: req.registeredBusiness.id,
			url_name: req.registeredBusiness.url_name,
			trade_name: req.registeredBusiness.trade_name,
			register_name: req.registeredBusiness.register_name,
			fiscal_code: req.registeredBusiness.fiscal_code,
			country_id: req.registeredBusiness.country_id
		}
	});
};


/**
 * Controlador: Responde con el business encontrado por ID
 */
const ctrl_business_get_by_id = (req, res) => {
	res.status(200).json({
		status: 200,
		message: 'Business found successfully',
		data: {
			id: req.business.id,
			url_name: req.business.url_name,
			trade_name: req.business.trade_name,
			register_name: req.business.register_name,
			fiscal_code: req.business.fiscal_code,
			country_id: req.business.country_id
		}
	});
};


/**
 * Controlador: Responde con el business encontrado por url_name
 */
const ctrl_business_get_by_url_name = (req, res) => {
	res.status(200).json({
		status: 200,
		message: 'Business found successfully',
		data: {
			id: req.business.id,
			url_name: req.business.url_name,
			trade_name: req.business.trade_name,
			register_name: req.business.register_name,
			fiscal_code: req.business.fiscal_code,
			country_id: req.business.country_id
		}
	});
};


module.exports = {
	ctrl_business_register,
	ctrl_business_get_by_id,
	ctrl_business_get_by_url_name
};
