
const CoreObject = require('./core_object');
const CoreBusiness = require('./core_business');
const { QueryTypes } = require('sequelize');
const { ERR_NOT_NULL } = require('./utils/msgs_error');


class CoreBusinessLocation extends CoreObject {
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
				business_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					validate: {
						notNull: {
							msg: `core_business_location.business_id: ${ERR_NOT_NULL}`
						}
					},
					references: {
						model: CoreBusiness,
						key: 'id'
					},
					field: 'business_id'
				},
				name: {
					type: DataTypes.STRING,
					allowNull: false,
					validate: {
						notNull: {
							msg: `core_business_location.name: ${ERR_NOT_NULL}`
						}
					},
					field: 'name'
				},
				address: {
					type: 'address',
					allowNull: true,
					field: 'address'
				},
			},
			{
				sequelize,
				modelName: 'CoreBusinessLocation',
				tableName: 'core_business_location',
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
				},
			}
		);
	}
}


module.exports = CoreBusinessLocation;
