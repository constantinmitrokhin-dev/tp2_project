
const {
	core_svc_country_find_by_id,
	core_svc_country_get_all,
	core_svc_countries_find_by_text,
	core_svc_country_find_by_name } = require('../services/svc_CoreCountry')
const {
	MDLW_ERR_COUNTRY_ID_NOT_FOUND,
	MDLW_ERR_COUNTRIES_NOT_FOUND,
	MDLW_ERR_COUNTRY_NAME_NOT_FOUND } = require('./utils/msgs_error');


const core_mdlw_validate_country_id = async (req, res, next) => {
	try {
		const v_country = await core_svc_country_find_by_id(req.validatedId);
		if (!v_country) {
			return res.status(404).json({
				status: 404,
				message: MDLW_ERR_COUNTRY_ID_NOT_FOUND
			});
		}
		req.country = v_country;
		next();
	} catch (error) {
		next(error);
	}
};


const core_mdlw_validate_countries = async (req, res, next) => {
	try {
		const v_countries = await core_svc_country_get_all();
		if (!v_countries) {
			return res.status(404).json({
				status: 404,
				message: MDLW_ERR_COUNTRIES_NOT_FOUND
			});
		}
		req.countries = v_countries;
		next();
	} catch (error) {
		next(error);
	}
};


const core_mdlw_validate_countries_by_text = async (req, res, next) => {
	try {
		const v_countries = await core_svc_countries_find_by_text(req.validatedText);
		if (!v_countries) {
			return res.status(404).json({
				status: 404,
				message: MDLW_ERR_COUNTRIES_NOT_FOUND
			});
		}
		req.countries = v_countries;
		next();
	} catch (error) {
		next(error);
	}
};


const core_mdlw_validate_countries_by_name = async (req, res, next) => {
	try {
		const v_country = await core_svc_country_find_by_name(req.validatedText);
		if (!v_country) {
			return res.status(404).json({
				status: 404,
				message: MDLW_ERR_COUNTRY_NAME_NOT_FOUND
			});
		}
		req.country = v_country;
		next();
	} catch (error) {
		next(error);
	}
};


module.exports = {
	core_mdlw_validate_country_id,
	core_mdlw_validate_countries,
	core_mdlw_validate_countries_by_text,
	core_mdlw_validate_countries_by_name
}
