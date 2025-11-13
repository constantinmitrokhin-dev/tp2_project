
const CoreUser = require('../../models/core_user.js');


module.exports = async function () {
	const usersArray = [
		{
			name: 'Carlos',
			middle_name: 'María',
			last_name: 'Perez',
			user_name: 'c_p',
			email: 'carlos.perez@mail.com',
			password: '123456789'
		}, {
			name: 'Carla',
			middle_name: 'José María',
			last_name: 'Gonzalez',
			user_name: 'carlita',
			email: 'carla_gonzalez@mail.com',
			password: 'qwerty123'
		},
	]
	usersArray.forEach(e => { CoreUser.create({ ...e }); });
}
