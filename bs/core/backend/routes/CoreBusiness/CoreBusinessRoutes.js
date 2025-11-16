
const { Router } = require('express');
const router = Router();
const {
	core_mdlw_validate_business_id,
	core_mdlw_register_business,
	core_mdlw_find_business_by_url_name
} = require('../../middlewares/mdlw_business');
const { core_mdlw_validate_id_format } = require('../../middlewares/mdlw_validate_format');
const {
	ctrl_business_register,
	ctrl_business_get_by_id,
	ctrl_business_get_by_url_name
} = require('../../controllers/ctrl_business');


//* Business
	// Register new Business and Default Employee
router.post('/register', core_mdlw_register_business, ctrl_business_register);


// Get Business by {url_name}
router.get('/byUrlName', core_mdlw_find_business_by_url_name, ctrl_business_get_by_url_name);


	// Get Business by ID
router.get(
	'/:id',
	core_mdlw_validate_id_format, 
	core_mdlw_validate_business_id,
	ctrl_business_get_by_id
);


module.exports = router;
