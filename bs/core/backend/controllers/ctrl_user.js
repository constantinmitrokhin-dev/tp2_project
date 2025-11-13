
const { core_svc_user_create } = require('../services/svc_CoreUser');


const core_ctrl_register_user = async (req, res, next) => {
	try {
		const { name, middle_name, last_name, user_name, email, password } = req.body;

		// Validar campos requeridos
		if (!name || !last_name || !user_name || !email || !password) {
			return res.status(400).json({
				status: 400,
				message: 'Faltan campos requeridos: name, last_name, user_name, email, password'
			});
		}

		// Crear el usuario
		const newUser = await core_svc_user_create(
			name,
			middle_name,
			last_name,
			user_name,
			email,
			password
		);

		// Responder con el usuario creado (sin el password)
		const userResponse = {
			id: newUser.id,
			name: newUser.name,
			middle_name: newUser.middle_name,
			last_name: newUser.last_name,
			user_name: newUser.user_name,
			email: newUser.email,
			status: newUser.status
		};

		return res.status(201).json({
			status: 201,
			message: 'Usuario creado correctamente',
			data: userResponse
		});

	} catch (error) {
		// Manejar errores de validación de Sequelize
		if (error.name === 'SequelizeValidationError') {
			return res.status(400).json({
				status: 400,
				message: 'Error de validación',
				errors: error.errors.map(err => err.message)
			});
		}

		// Manejar errores de unicidad (email o user_name duplicado)
		if (error.name === 'SequelizeUniqueConstraintError') {
			return res.status(409).json({
				status: 409,
				message: 'El email o nombre de usuario ya existe'
			});
		}

		// Cualquier otro error
		next(error);
	}
};


module.exports = {
	core_ctrl_register_user
};
