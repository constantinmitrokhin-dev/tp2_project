
const {
	MDLW_ERR_ID_VALIDATION,
	MDLW_ERR_TEXT_VALIDATION } = require('./utils/msgs_error');


///* ===============================================
//*  FUNCIONES AUXILIARES REUTILIZABLES
//* ===============================================


const core_mdlw_validate_id_format = (req, res, next) => {
	const { id } = req.params;

	const formatedId = Number(id);
	if (isNaN(formatedId) || formatedId <= 0){
		return res.status(400).json({
			status: 400,
			message: MDLW_ERR_ID_VALIDATION
		});
	}

	req.validatedId = formatedId;
	next();
}


const core_mdlw_validate_text_search_format = (req, res, next) => {
	const { text } = req.query;

	const formatedText = text ? text.trim().replace(/\s{2,}/g, ' ') : '';
	if (typeof formatedText !== 'string' || formatedText === '' || formatedText === undefined){
		return res.status(400).json({
			status: 400,
			message: MDLW_ERR_TEXT_VALIDATION
		});
	}

	req.validatedText = formatedText;
	next();
}


const core_mdlw_validate_required_fields = (p_input_data, p_required_fields) => {
	return p_required_fields.every(field => {
		const value = p_input_data[field];
		return value !== undefined && value !== null && value !== '';
	});
};


module.exports = {
	core_mdlw_validate_id_format,
	core_mdlw_validate_text_search_format,
	core_mdlw_validate_required_fields
}
