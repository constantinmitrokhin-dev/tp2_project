
const { Op } = require('sequelize');
const CoreUser = require('../models/core_user');
const { USER_STATUS_ENUM } = require('../models/utils/constants');


///* Find CoreUser by username or email (excluding users with a specific status, DEFAULT: 'inactive')
const core_svc_user_find_active_by_user_name_or_email = async (p_login_input) => {
	return await CoreUser.findOne({ where: {
		status: USER_STATUS_ENUM[1],
		[Op.or]: [ { user_name: p_login_input }, { email: p_login_input } ] }
	});
}


//* Validate User existance
const core_svc_user_exists_by_user_name_or_email = async (p_user_name, p_email) => {
	const user = await CoreUser.findOne({
		where: {
			[Op.or]: [
				{ user_name: p_user_name },
				{ email: p_email }
			]
		}
	});
	console.log('Entra 3');
	
console.log(user);

	return !!user;
};


//* Find a CoreUser by its primary key (ID)
const core_svc_user_find_by_id = async (p_user_id) => {
	return await CoreUser.findByPk(p_user_id);
}


//* Create a new CoreUser record with the provided data
const core_svc_user_create = async ({name, middle_name = null, last_name, user_name, email, password}) => {
	return await CoreUser.create({ name, middle_name, last_name, user_name, email, password });
}


//* Update an existing CoreUser’s profile
const core_svc_user_update = async (p_user) => {
	return await p_user.save();
}


//* Soft-delete a CoreUser by setting its status to 'inactive'
const core_svc_user_delete = async (p_user) => {
	p_user.status = USER_STATUS_ENUM[2];
	return await p_user.save();
}


module.exports = {
	core_svc_user_find_active_by_user_name_or_email,
	core_svc_user_exists_by_user_name_or_email,
	core_svc_user_find_by_id,
	core_svc_user_create,
	core_svc_user_update,
	core_svc_user_delete
}
