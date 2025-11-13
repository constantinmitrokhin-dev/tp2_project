
const { Router } = require('express');
const router = Router();
const {
	core_mdlw_validate_id_format,
	core_mdlw_validate_text_search_format } = require('../../middlewares/mdlw_validate_format');
const { core_mdlw_validate_country_id } = require('../../middlewares/mdlw_country');
const {
	core_mdlw_validate_state_id,
	core_mdlw_validate_states,
	core_mdlw_validate_state_by_text } = require('../../middlewares/mdlw_state');
const {
	core_ctrl_get_state,
	core_ctrl_get_states } = require('../../controllers/ctrl_state');


//* State
	// Get All States by country {id}
router.get(
	'/all',
	core_mdlw_validate_id_format,
	core_mdlw_validate_country_id,
	core_mdlw_validate_states,
	core_ctrl_get_states
);


	// Get State´s by exact {name}
router.get(
	'/byName',
	core_mdlw_validate_id_format,
	core_mdlw_validate_text_search_format,
	core_mdlw_validate_country_id,
	core_mdlw_validate_state_by_text,
	core_ctrl_get_state
);


	// Get State  by state´s {id}
router.get(
	'/:id',
	core_mdlw_validate_id_format,
	core_mdlw_validate_state_id,
	core_ctrl_get_state
);


module.exports = router;
