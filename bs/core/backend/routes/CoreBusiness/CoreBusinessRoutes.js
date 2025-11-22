
const { Router } = require('express');
const router = Router();
const {
	core_mdlw_validate_business_id,
	core_mdlw_get_business_by_url_name,
	core_mdlw_register_business
} = require('../../middlewares/mdlw_business');
const { core_mdlw_validate_id_format } = require('../../middlewares/mdlw_validate_format');
const {
	core_ctrl_register_business,
	core_ctrl_get_business
} = require('../../controllers/ctrl_business');


//* Register new Business
router.post('/register', core_mdlw_register_business, core_ctrl_register_business);

//* Get Business by url_name
router.get('/byUrlName', core_mdlw_get_business_by_url_name, core_ctrl_get_business);

//* Get Business by ID
router.get('/:id', core_mdlw_validate_id_format, core_mdlw_validate_business_id, core_ctrl_get_business);


module.exports = router;
