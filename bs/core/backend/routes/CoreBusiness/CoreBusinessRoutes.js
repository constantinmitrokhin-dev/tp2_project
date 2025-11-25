
const { Router } = require('express');
const router = Router();
const {
	core_mdlw_validate_business_id,
	core_mdlw_register_business,
	core_mdlw_find_business_by_url_name } = require('../../middlewares/mdlw_business');
const { core_mdlw_validate_id_format } = require('../../middlewares/mdlw_validate_format');
const {
	core_ctrl_get_business,
	core_ctrl_get_business_with_locations } = require('../../controllers/ctrl_business');


//* Business
	// Register new Business and Default Employee
router.post(
	'/register',
	core_mdlw_register_business,
	core_ctrl_get_business
);


// Get Business by {url_name}
router.get(
	'/byUrlName',
	core_mdlw_find_business_by_url_name,
	core_ctrl_get_business_with_locations
);


	// Get Business by ID
router.get(
	'/:id',
	core_mdlw_validate_id_format,
	core_mdlw_validate_business_id,
	core_ctrl_get_business_with_locations
);


module.exports = router;
