
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;


const core_ctrl_create_jwt = (id, username) => {
	return jwt.sign(
		{ id, username },
		JWT_SECRET,
		{ expiresIn: '3h' }
	)
}


module.exports = {
	core_ctrl_create_jwt
}
