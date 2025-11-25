
///* ===============================================
//*  CONTROLLERS USER
//* ================================================


const core_ctrl_get_user = (req, res) => {
	const { ht_data, password, jwt, ...rest } = req.user.get({ plain: true });
	return res.status(200).json({ user: rest, cookies: req.user.jwt });
}


module.exports = {
	core_ctrl_get_user
};
