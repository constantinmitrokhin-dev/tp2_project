
const CoreObject = require('./core_object');
const CoreUser = require('./core_user');
const CoreBusiness = require('./core_business');
const { QueryTypes } = require('sequelize');


class CoreUserBusiness extends CoreObject {
	static initModel(sequelize, DataTypes) {
		super.init(
			{
				user_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					unique: true,
					references: {
						model: CoreUser,
						key: 'id'
					}
				},
				business_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					references: {
						model: CoreBusiness,
						key: 'id'
					}
				},
				role: {
					type: DataTypes.TEXT,
					allowNull: true
				}
			},
			{
				sequelize,
				modelName: 'CoreUserBusiness',
				tableName: 'core_user_business',
				schema: 'public',
				timestamps: false,
				hooks: {
					beforeValidate: async (instance, options) => {
						const txOpt = options?.transaction ? { transaction: options.transaction } : {};

						const [parent] = await sequelize.query(
							`INSERT INTO core_object DEFAULT VALUES RETURNING id, ht_data`,
							{ type: QueryTypes.SELECT, ...txOpt }
						);

						if (!parent) throw new Error('No se pudo crear core_object');

						instance.id = parent.id;
						instance.ht_data = parent.ht_data;
					}
				}
			}
		);
		return this;
	}
}


module.exports = CoreUserBusiness;
