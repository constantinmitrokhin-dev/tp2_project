
const {
	core_svc_user_find_by_id,
	core_svc_user_create,
	core_svc_user_find_active_by_user_name_or_email,
	core_svc_user_update,
	core_svc_user_delete } = require('../services/svc_CoreUser');
const {
	MDLW_ERR_USER_ID_NOT_FOUND,
	MDLW_ERR_USER_ALREADY_EXISTS,
	MDLW_ERR_USER_REGISTRATION_FAILED,
	MDLW_ERR_USER_MISSING_FIELDS,
	MDLW_ERR_LOGIN_MISSING_FIELDS,
	MDLW_ERR_INVALID_CREDENTIALS,
	MDLW_ERR_USER_NOT_ACTIVE,
	MDLW_ERR_LOGIN_FAILED,
	MDLW_ERR_NO_UPDATE_DATA,
	MDLW_ERR_USER_UPDATE_FAILED,
	MDLW_ERR_USERNAME_EMAIL_IN_USE,
	MDLW_ERR_PASSWORD_MISSING_FIELDS,
	MDLW_ERR_INVALID_CURRENT_PASSWORD,
	MDLW_ERR_PASSWORD_UPDATE_FAILED,
	MDLW_ERR_USER_DELETE_FAILED } = require('./utils/msgs_error');


///* ===============================================
//*  FUNCIONES AUXILIARES REUTILIZABLES
//* ===============================================

const validateRequiredFields = (userData, requiredFields) => {
	return requiredFields.every(field => {
		const value = userData[field];
		return value !== undefined && value !== null && value !== '';
	});
};

const checkUserExists = async (user_name, email) => {
	const v_existing_user = await core_svc_user_find_active_by_user_name_or_email(user_name);
	const v_existing_email = await core_svc_user_find_active_by_user_name_or_email(email);
	return !!(v_existing_user || v_existing_email);
};

const createAndActivateUser = async ({ name, middle_name, last_name, user_name, email, password }) => {
	const v_new_user = await core_svc_user_create(
		name,
		middle_name || null,
		last_name,
		user_name,
		email,
		password
	);

	if (!v_new_user) {
		throw new Error(MDLW_ERR_USER_REGISTRATION_FAILED);
	}

	// Activar el usuario (cambiar status de 'inactive' a 'active')
	await v_new_user.activateUser();

	return v_new_user;
};


const handleSequelizeError = (error) => {
	if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
		return {
			status: 400,
			message: error.errors ? error.errors.map(e => e.message).join(', ') : error.message
		};
	}
	return null;
};


const findActiveUser = async (login_input) => {
	return await core_svc_user_find_active_by_user_name_or_email(login_input);
};


const validateUserPassword = async (user, password) => {
	return await user.comparePassword(password);
};


const generateUserToken = async (user) => {
	return await user.createJwt();
};


const getUpdatableFields = (bodyData) => {
	const allowedFields = ['name', 'middle_name', 'last_name', 'user_name', 'email'];
	const updatableData = {};
	
	allowedFields.forEach(field => {
		if (bodyData[field] !== undefined) {
			updatableData[field] = bodyData[field];
		}
	});
	 
	return updatableData;
};


const checkUsernameEmailAvailability = async (user_name, email, currentUserId) => {
	const existingUserByUsername = user_name ? await core_svc_user_find_active_by_user_name_or_email(user_name) : null;
	const existingUserByEmail = email ? await core_svc_user_find_active_by_user_name_or_email(email) : null;
	
	const isUsernameInUse = existingUserByUsername && existingUserByUsername.id !== currentUserId;
	const isEmailInUse = existingUserByEmail && existingUserByEmail.id !== currentUserId;
	
	return !(isUsernameInUse || isEmailInUse);
};


const updateUserData = async (user, updateData) => {
	Object.keys(updateData).forEach(key => {
		user[key] = updateData[key];
	});
	
	return await core_svc_user_update(user);
};


///* ===============================================
//*  MIDDLEWARES
//* ===============================================

const core_mdlw_validate_user_id = async (req, res, next) => {
	try {
		const v_user = await core_svc_user_find_by_id(req.validatedId);
		if (!v_user) {
			return res.status(404).json({
				status: 404,
				message: MDLW_ERR_USER_ID_NOT_FOUND
			});
		}
		req.user = v_user;
		next();
	} catch (error) {
		next(error);
	}
};


/**
 * Middleware: Valida los campos requeridos del registro de usuario
 */
const core_mdlw_validate_registration_fields = (req, res, next) => {
	const requiredFields = ['name', 'last_name', 'user_name', 'email', 'password'];
	
	if (!validateRequiredFields(req.body, requiredFields)) {
		return res.status(400).json({
			status: 400,
			message: MDLW_ERR_USER_MISSING_FIELDS
		});
	}
	
	next();
};


/**
 * Middleware: Verifica que el usuario no exista (username o email)
 */
const core_mdlw_check_user_uniqueness = async (req, res, next) => {
	try {
		const { user_name, email } = req.body;
		
		const userExists = await checkUserExists(user_name, email);
		
		if (userExists) {
			return res.status(409).json({
				status: 409,
				message: MDLW_ERR_USER_ALREADY_EXISTS
			});
		}
		
		next();
	} catch (error) {
		next(error);
	}
};


/**
 * Middleware: Crea un nuevo usuario y lo activa
 */
const core_mdlw_create_user = async (req, res, next) => {
	try {
		const { name, middle_name, last_name, user_name, email, password } = req.body;
		
		const v_new_user = await createAndActivateUser({
			name,
			middle_name,
			last_name,
			user_name,
			email,
			password
		});

		// Adjuntar el usuario creado al request
		req.registeredUser = v_new_user;
		next();
	} catch (error) {
		const sequelizeError = handleSequelizeError(error);
		
		if (sequelizeError) {
			return res.status(sequelizeError.status).json(sequelizeError);
		}
		
		// Si no es error de Sequelize, verificar si es el error personalizado
		if (error.message === MDLW_ERR_USER_REGISTRATION_FAILED) {
			return res.status(500).json({
				status: 500,
				message: error.message
			});
		}
		
		next(error);
	}
};


const core_mdlw_register_user = async (req, res, next) => {
	try {
		// Validar campos requeridos
		const requiredFields = ['name', 'last_name', 'user_name', 'email', 'password'];
		if (!validateRequiredFields(req.body, requiredFields)) {
			return res.status(400).json({
				status: 400,
				message: MDLW_ERR_USER_MISSING_FIELDS
			});
		}

		// Verificar que el usuario no exista
		const { user_name, email } = req.body;
		const userExists = await checkUserExists(user_name, email);
		if (userExists) {
			return res.status(409).json({
				status: 409,
				message: MDLW_ERR_USER_ALREADY_EXISTS
			});
		}

		// Crear y activar el usuario
		const { name, middle_name, last_name, password } = req.body;
		const v_new_user = await createAndActivateUser({
			name,
			middle_name,
			last_name,
			user_name,
			email,
			password
		});

		// Adjuntar el usuario creado al request
		req.registeredUser = v_new_user;
		next();
	} catch (error) {
		const sequelizeError = handleSequelizeError(error);
		
		if (sequelizeError) {
			return res.status(sequelizeError.status).json(sequelizeError);
		}
		
		if (error.message === MDLW_ERR_USER_REGISTRATION_FAILED) {
			return res.status(500).json({
				status: 500,
				message: error.message
			});
		}
		
		next(error);
	}
};


///* ===============================================
//*  MIDDLEWARES DE LOGIN
//* ===============================================

const core_mdlw_validate_login_fields = (req, res, next) => {
	const requiredFields = ['login', 'password'];
	
	if (!validateRequiredFields(req.body, requiredFields)) {
		return res.status(400).json({
			status: 400,
			message: MDLW_ERR_LOGIN_MISSING_FIELDS
		});
	}
	
	next();
};


const core_mdlw_find_user_by_login = async (req, res, next) => {
	try {
		const { login } = req.body;
		
		const v_user = await findActiveUser(login);
		
		if (!v_user) {
			return res.status(401).json({
				status: 401,
				message: MDLW_ERR_INVALID_CREDENTIALS
			});
		}
		
		req.foundUser = v_user;
		next();
	} catch (error) {
		next(error);
	}
};


const core_mdlw_verify_password = async (req, res, next) => {
	try {
		const { password } = req.body;
		const v_user = req.foundUser;
		
		const isPasswordValid = await validateUserPassword(v_user, password);
		
		if (!isPasswordValid) {
			return res.status(401).json({
				status: 401,
				message: MDLW_ERR_INVALID_CREDENTIALS
			});
		}
		
		next();
	} catch (error) {
		next(error);
	}
};


const core_mdlw_generate_token = async (req, res, next) => {
	try {
		const v_user = req.foundUser;
		
		const token = await generateUserToken(v_user);
		
		if (!token) {
			return res.status(500).json({
				status: 500,
				message: MDLW_ERR_LOGIN_FAILED
			});
		}
		
		req.authenticatedUser = v_user;
		req.token = token;
		next();
	} catch (error) {
		next(error);
	}
};


const core_mdlw_login_user = async (req, res, next) => {
	try {
		// Validar campos requeridos
		const requiredFields = ['login', 'password'];
		if (!validateRequiredFields(req.body, requiredFields)) {
			return res.status(400).json({
				status: 400,
				message: MDLW_ERR_LOGIN_MISSING_FIELDS
			});
		}

		// Buscar usuario activo
		const { login, password } = req.body;
		const v_user = await findActiveUser(login);
		
		if (!v_user) {
			return res.status(401).json({
				status: 401,
				message: MDLW_ERR_INVALID_CREDENTIALS
			});
		}

		// Verificar contraseña
		const isPasswordValid = await validateUserPassword(v_user, password);
		
		if (!isPasswordValid) {
			return res.status(401).json({
				status: 401,
				message: MDLW_ERR_INVALID_CREDENTIALS
			});
		}

		// Generar token JWT
		const token = await generateUserToken(v_user);
		
		if (!token) {
			return res.status(500).json({
				status: 500,
				message: MDLW_ERR_LOGIN_FAILED
			});
		}

		// Adjuntar usuario y token al request
		req.authenticatedUser = v_user;
		req.token = token;
		next();
	} catch (error) {
		next(error);
	}
};


///* ===============================================
//*  MIDDLEWARES DE ACTUALIZACIÓN
//* ===============================================

const core_mdlw_validate_update_data = (req, res, next) => {
	const updatableData = getUpdatableFields(req.body);
	
	if (Object.keys(updatableData).length === 0) {
		return res.status(400).json({
			status: 400,
			message: MDLW_ERR_NO_UPDATE_DATA
		});
	}
	
	req.updatableData = updatableData;
	next();
};


const core_mdlw_check_update_uniqueness = async (req, res, next) => {
	try {
		const { user_name, email } = req.updatableData;
		const currentUserId = req.user.id;
		
		const isAvailable = await checkUsernameEmailAvailability(user_name, email, currentUserId);
		
		if (!isAvailable) {
			return res.status(409).json({
				status: 409,
				message: MDLW_ERR_USERNAME_EMAIL_IN_USE
			});
		}
		
		next();
	} catch (error) {
		next(error);
	}
};


const core_mdlw_update_user_data = async (req, res, next) => {
	try {
		const updatedUser = await updateUserData(req.user, req.updatableData);
		
		if (!updatedUser) {
			return res.status(500).json({
				status: 500,
				message: MDLW_ERR_USER_UPDATE_FAILED
			});
		}
		
		req.updatedUser = updatedUser;
		next();
	} catch (error) {
		const sequelizeError = handleSequelizeError(error);
		
		if (sequelizeError) {
			return res.status(sequelizeError.status).json(sequelizeError);
		}
		
		if (error.message === MDLW_ERR_USER_UPDATE_FAILED) {
			return res.status(500).json({
				status: 500,
				message: error.message
			});
		}
		
		next(error);
	}
};


const core_mdlw_update_user = async (req, res, next) => {
	try {
		// Validar que haya datos para actualizar
		const updatableData = getUpdatableFields(req.body);
		
		if (Object.keys(updatableData).length === 0) {
			return res.status(400).json({
				status: 400,
				message: MDLW_ERR_NO_UPDATE_DATA
			});
		}

		// Verificar disponibilidad de username/email si se están actualizando
		const { user_name, email } = updatableData;
		const currentUserId = req.user.id;
		
		if (user_name || email) {
			const isAvailable = await checkUsernameEmailAvailability(user_name, email, currentUserId);
			
			if (!isAvailable) {
				return res.status(409).json({
					status: 409,
					message: MDLW_ERR_USERNAME_EMAIL_IN_USE
				});
			}
		}

		// Actualizar datos del usuario
		const updatedUser = await updateUserData(req.user, updatableData);
		
		if (!updatedUser) {
			return res.status(500).json({
				status: 500,
				message: MDLW_ERR_USER_UPDATE_FAILED
			});
		}

		req.updatedUser = updatedUser;
		next();
	} catch (error) {
		const sequelizeError = handleSequelizeError(error);
		
		if (sequelizeError) {
			return res.status(sequelizeError.status).json(sequelizeError);
		}
		
		if (error.message === MDLW_ERR_USER_UPDATE_FAILED) {
			return res.status(500).json({
				status: 500,
				message: error.message
			});
		}
		
		next(error);
	}
};


///* ===============================================
//*  MIDDLEWARES DE CONTRASEÑA Y ELIMINACIÓN
//* ===============================================

const core_mdlw_update_password = async (req, res, next) => {
	try {
		const { current_password, new_password } = req.body;
		
		// Validar campos requeridos
		if (!current_password || !new_password) {
			return res.status(400).json({
				status: 400,
				message: MDLW_ERR_PASSWORD_MISSING_FIELDS
			});
		}

		// Verificar contraseña actual
		const isPasswordValid = await validateUserPassword(req.user, current_password);
		if (!isPasswordValid) {
			return res.status(401).json({
				status: 401,
				message: MDLW_ERR_INVALID_CURRENT_PASSWORD
			});
		}

		// Actualizar contraseña (el hook beforeUpdate hasheará automáticamente)
		req.user.password = new_password;
		const updatedUser = await core_svc_user_update(req.user);
		
		if (!updatedUser) {
			return res.status(500).json({
				status: 500,
				message: MDLW_ERR_PASSWORD_UPDATE_FAILED
			});
		}

		req.updatedUser = updatedUser;
		next();
	} catch (error) {
		const sequelizeError = handleSequelizeError(error);
		if (sequelizeError) {
			return res.status(sequelizeError.status).json(sequelizeError);
		}
		next(error);
	}
};


const core_mdlw_delete_user = async (req, res, next) => {
	try {
		const deletedUser = await core_svc_user_delete(req.user);
		
		if (!deletedUser) {
			return res.status(500).json({
				status: 500,
				message: MDLW_ERR_USER_DELETE_FAILED
			});
		}

		req.deletedUser = deletedUser;
		next();
	} catch (error) {
		next(error);
	}
};


module.exports = {
	// Middlewares principales
	core_mdlw_validate_user_id,
	core_mdlw_register_user,
	core_mdlw_login_user,
	core_mdlw_update_user,
	core_mdlw_update_password,
	core_mdlw_delete_user,
	
	// Middlewares modulares de registro (reutilizables)
	core_mdlw_validate_registration_fields,
	core_mdlw_check_user_uniqueness,
	core_mdlw_create_user,
	
	// Middlewares modulares de login (reutilizables)
	core_mdlw_validate_login_fields,
	core_mdlw_find_user_by_login,
	core_mdlw_verify_password,
	core_mdlw_generate_token,
	
	// Middlewares modulares de actualización (reutilizables)
	core_mdlw_validate_update_data,
	core_mdlw_check_update_uniqueness,
	core_mdlw_update_user_data,
	
	// Funciones auxiliares (reutilizables)
	validateRequiredFields,
	checkUserExists,
	createAndActivateUser,
	handleSequelizeError,
	findActiveUser,
	validateUserPassword,
	generateUserToken,
	getUpdatableFields,
	checkUsernameEmailAvailability,
	updateUserData
}

