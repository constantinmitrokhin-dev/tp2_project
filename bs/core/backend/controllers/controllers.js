
// Entry point for backend controllers

const {
	core_ctrl_register_user
} = require('./ctrl_user');

const {
	core_ctrl_get_country,
	core_ctrl_get_countries
} = require('./ctrl_coutry');


module.exports = {
	// User controllers
	core_ctrl_register_user,

	// Country controllers
	core_ctrl_get_country,
	core_ctrl_get_countries
};