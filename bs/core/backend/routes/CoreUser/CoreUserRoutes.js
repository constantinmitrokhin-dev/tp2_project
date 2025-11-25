
const { Router } = require('express');
const router = Router();
const {
	core_mdlw_register_user,
	core_mdlw_login_user,
	core_mdlw_validate_user_id,
	core_mdlw_update_user,
	core_mdlw_update_password,
	core_mdlw_delete_user
} = require('../../middlewares/mdlw_user');
const { core_mdlw_validate_id_format } = require('../../middlewares/mdlw_validate_format');
const { core_ctrl_get_user } = require('../../controllers/ctrl_user.js');


//* User
	//* User Registration
router.post(
	'/register',
	core_mdlw_register_user,
	core_ctrl_get_user
);


	//* User Login
router.post(
	'/login',
	core_mdlw_login_user,
	core_ctrl_get_user
);

	//* Update User Data
router.patch(
	'/update/:id',
	core_mdlw_validate_id_format,
	core_mdlw_validate_user_id,
	core_mdlw_update_user,
	core_ctrl_get_user
);


	// Update Password
router.patch(
	'/updatePass/:id',
	core_mdlw_validate_id_format,
	core_mdlw_validate_user_id,
	core_mdlw_update_password,
	core_ctrl_get_user
);


	// Delete User
router.delete(
	'/delete/:id',
	core_mdlw_validate_id_format,
	core_mdlw_validate_user_id,
	core_mdlw_delete_user
);


module.exports = router;
