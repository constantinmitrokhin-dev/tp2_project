
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


//* User
router.post('/register', core_mdlw_register_user, (req, res) => {
	res.status(201).json({
		status: 201,
		message: `Account created successfully ${req.registeredUser.user_name}`
	});
});


	// Login
router.post('/login', core_mdlw_login_user, (req, res) => {
	res.status(200).json({
		status: 200,
		message: `Welcome back ${req.authenticatedUser.user_name}!`
	});
});


	// Update User´s Data
router.patch('/update/:id', core_mdlw_validate_id_format, core_mdlw_validate_user_id, core_mdlw_update_user, (req, res) => {
	res.status(200).json({
		status: 200,
		message: `User ${req.updatedUser.user_name} updated successfully`
	});
});


	// Update Password
router.patch('/updatePass/:id', core_mdlw_validate_id_format, core_mdlw_validate_user_id, core_mdlw_update_password, (req, res) => {
	res.status(200).json({
		status: 200,
		message: `Password updated successfully for user ${req.updatedUser.user_name}`
	});
});


	// Delete User
router.delete('/delete/:id', core_mdlw_validate_id_format, core_mdlw_validate_user_id, core_mdlw_delete_user, (req, res) => {
	res.status(200).json({
		status: 200,
		message: `User ${req.deletedUser.user_name} deleted successfully`
	});
});


module.exports = router;
