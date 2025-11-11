
const CoreObject = require('./core_object');
const { QueryTypes } = require('sequelize');
const bcrypt = require('bcrypt');


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
					field: 'name'
				},
				middle_name: {
					type: DataTypes.STRING,
					allowNull: true,
					field: 'middle_name'
				},
				last_name: {
					type: DataTypes.STRING,
					allowNull: false,
					field: 'last_name'
				},
				user_name: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true,
					field: 'user_name'
				},
				email: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true,
					field: 'email'
				},
				password: {
					type: DataTypes.STRING,
					allowNull: false,
					field: 'password'
				},
				jwt: {
					type: DataTypes.STRING,
					allowNull: true,
					field: 'jwt'
				},
				status: {
					type: DataTypes.ENUM('active', 'inactive', 'pending'),
					allowNull: false,
					defaultValue: 'pending',
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
