
const CoreObject = require('./core_object');
const { QueryTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const { REGEX_ALPHABETICAL_FULL, REGEX_USERNAME, USER_PASSWORD_LEN, USER_STATUS_ENUM } = require('./utils/constants');
const { ERR_REGEX_ALPHABETICAL_FULL, ERR_REGEX_USERNAME, ERR_IS_EMAIL, ERR_USER_PASSWORD_LEN, ERR_NOT_NULL } = require('./utils/msgs_error');


class CoreUser extends CoreObject {
	static initModel(sequelize, DataTypes) {
		super.init(
			{
				id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					foreignKey: true,
					primaryKey: true,
					references: {
						model: CoreObject,
						key: 'id'
					},
					field: 'id'
				},
				ht_data: {
					type: 'ht_data', // usa el tipo personalizado definido en la DB
					allowNull: false,
					field: 'ht_data'
				},
				name: {
					type: DataTypes.STRING,
					allowNull: false,
					validate: {
						notNull: {
							msg: `core_user.name: ${ERR_NOT_NULL}`
						},
						is: {
							args: REGEX_ALPHABETICAL_FULL,
							msg: `core_user.name: ${ERR_REGEX_ALPHABETICAL_FULL}`
						}
					},
					field: 'name'
				},
				middle_name: {
					type: DataTypes.STRING,
					allowNull: true,
					validate: {
						is: {
							args: REGEX_ALPHABETICAL_FULL,
							msg: `core_user.middle_name: ${ERR_REGEX_ALPHABETICAL_FULL}`
						}
					},
					field: 'middle_name'
				},
				last_name: {
					type: DataTypes.STRING,
					allowNull: false,
					validate: {
						notNull: {
							msg: `core_user.last_name: ${ERR_NOT_NULL}`
						},
						is: {
							args: REGEX_ALPHABETICAL_FULL,
							msg: `core_user.last_name: ${ERR_REGEX_ALPHABETICAL_FULL}`
						}
					},
					field: 'last_name'
				},
				user_name: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true,
					validate: {
						notNull: {
							msg: `core_user.user_name: ${ERR_NOT_NULL}`
						},
						is: {
							args: REGEX_USERNAME,
							msg: `core_user.user_name: ${ERR_REGEX_USERNAME}`
						}
					},
					field: 'user_name'
				},
				email: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true,
					validate: {
						notNull: {
							msg: `core_user.email: ${ERR_NOT_NULL}`
						},
						isEmail: {
							msg: `core_user.email: ${ERR_IS_EMAIL}`
						}
					},
					field: 'email'
				},
				password: {
					type: DataTypes.STRING,
					allowNull: false,
					validate: {
						notNull: {
							msg: `core_user.password: ${ERR_NOT_NULL}`
						},
						len: {
							args: USER_PASSWORD_LEN,
							msg: `core_user.password: ${ERR_USER_PASSWORD_LEN}`
						}
					},
					field: 'password'
				},
				jwt: {
					type: DataTypes.STRING,
					allowNull: true,
					field: 'jwt'
				},
				status: {
					type: DataTypes.ENUM,
					allowNull: false,
					values: USER_STATUS_ENUM,
					defaultValue: USER_STATUS_ENUM[0],
					field: 'status'
				}
			},
			{
				sequelize,
				modelName: 'CoreUser',
				tableName: 'core_user',
				timestamps: false,
				relationships: {
					type: 'inheritance',
					parent: CoreObject,
					foreignKey: 'id'
				},
				hooks: {
					beforeValidate: async (instance, options) => {
						/* if (!instance.isNewRecord) return; */  // TODO: Activar esta línea par evitar duplicado de core_object en los update
						// Este hook corre ANTES de la validación de notNull
						const txOpt = options?.transaction ? { transaction: options.transaction } : {};

						const [parent] = await sequelize.query(
							`INSERT INTO core_object DEFAULT VALUES RETURNING id, ht_data`,
							{ type: QueryTypes.SELECT, ...txOpt }
						);

						if (!parent) throw new Error('No se pudo crear core_object');

						instance.id = parent.id;
						instance.ht_data = parent.ht_data;
					},
					beforeCreate: async (instance, options) => {
						// Hash del password antes de crear el usuario
						if (instance.password) {
							const saltRounds = 10;
							instance.password = await bcrypt.hash(instance.password, saltRounds);
						}
					},
					beforeUpdate: async (instance, options) => {
						// Hash del password antes de actualizar solo si fue modificado
						if (instance.changed('password')) {
							const saltRounds = 10;
							instance.password = await bcrypt.hash(instance.password, saltRounds);
						}
					},
				},
			}
		);
	}

	// Método de instancia para comparar password
	async comparePassword(candidatePassword) {
		return await bcrypt.compare(candidatePassword, this.password);
	}
}


module.exports = CoreUser;
