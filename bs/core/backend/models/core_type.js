
const CoreObject = require('./core_object');
const { QueryTypes } = require('sequelize');
const { ERR_NOT_NULL } = require('./utils/msgs_error');


class CoreType extends CoreObject {
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
					unique: 'kind_name_business_id',
					validate: {
						notNull: {
							msg: `core_type.name: ${ERR_NOT_NULL}`
						}
					},
					field: 'name'
				}
			},
			{
				sequelize,
				modelName: 'CoreType',
				tableName: 'core_type',
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


module.exports = CoreType;
