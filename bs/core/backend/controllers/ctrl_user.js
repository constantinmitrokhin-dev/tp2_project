
const core_ctrl_register_user = (req, res) => {
	const { ht_data, password, ...rest } = req.registeredUser.get({ plain: true });
	return res.status(201).json({
		status: 201,
		message: `Account created successfully`,
		user: rest
	});
};


const core_ctrl_login_user = (req, res) => {
	const { ht_data, password, ...rest } = req.authenticatedUser.get({ plain: true });
	return res.status(200).json({
		status: 200,
		message: `Welcome back ${req.authenticatedUser.user_name}!`,
		user: rest,
		token: req.token
	});
};


const core_ctrl_get_user = (req, res) => {
	const { ht_data, password, ...rest } = req.user.get({ plain: true });
	return res.status(200).json({ user: rest });
};


const core_ctrl_update_user = (req, res) => {
	const { ht_data, password, ...rest } = req.updatedUser.get({ plain: true });
	return res.status(200).json({
		status: 200,
		message: `User updated successfully`,
		user: rest
	});
};


const core_ctrl_update_password = (req, res) => {
	return res.status(200).json({
		status: 200,
		message: `Password updated successfully for user ${req.updatedUser.user_name}`
	});
};


const core_ctrl_delete_user = (req, res) => {
	return res.status(200).json({
		status: 200,
		message: `User ${req.deletedUser.user_name} deleted successfully`
	});
};


module.exports = {
	core_ctrl_register_user,
	core_ctrl_login_user,
	core_ctrl_get_user,
	core_ctrl_update_user,
	core_ctrl_update_password,
	core_ctrl_delete_user
};

