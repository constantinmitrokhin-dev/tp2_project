
// Entry point for backend middlewares

const {
	core_mdlw_validate_country_id,
	core_mdlw_validate_countries,
	core_mdlw_validate_countries_by_text,
	core_mdlw_validate_countries_by_name
} = require('./mdlw_country');

const {
	core_mdlw_validate_id_format,
	core_mdlw_validate_text_search_format
} = require('./mdlw_validate_format');


module.exports = {
	// Country middlewares
	core_mdlw_validate_country_id,
	core_mdlw_validate_countries,
	core_mdlw_validate_countries_by_text,
	core_mdlw_validate_countries_by_name,

	// Validation format middlewares
	core_mdlw_validate_id_format,
	core_mdlw_validate_text_search_format
};