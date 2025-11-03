
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;


const core_mdlw_validate_jwt = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) return res.status(401).json({ error: "No token provided" });

	const token = authHeader.split(' ')[1];
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(403).json({ error: "Your session has expired." });
	}
};


module.exports = {
	core_mdlw_validate_jwt
}