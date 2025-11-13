
const { Router } = require('express');
const router = Router();
const {
	core_mdlw_validate_id_format,
	core_mdlw_validate_text_search_format } = require('../../middlewares/mdlw_validate_format');
const {
	core_mdlw_validate_country_id,
	core_mdlw_validate_countries,
	core_mdlw_validate_countries_by_text,
	core_mdlw_validate_countries_by_name } = require('../../middlewares/mdlw_country');
const {
	core_ctrl_get_country,
	core_ctrl_get_countries } = require('../../controllers/ctrl_coutry');


//* Country
	// Get All Countries
router.get(
	'/all',
	core_mdlw_validate_countries,
	core_ctrl_get_countries
);


	// Get Countries by aprox {name}
router.get(
	'/byText',
	core_mdlw_validate_text_search_format,
	core_mdlw_validate_countries_by_text,
	core_ctrl_get_countries
);


	// Get Country´s by exact {name}
router.get(
	'/byName',
	core_mdlw_validate_text_search_format,
	core_mdlw_validate_countries_by_name,
	core_ctrl_get_country
);


	// Get Country by country´s {id}
router.get(
	'/:id',
	core_mdlw_validate_id_format,
	core_mdlw_validate_country_id,
	core_ctrl_get_country
);


module.exports = router;
