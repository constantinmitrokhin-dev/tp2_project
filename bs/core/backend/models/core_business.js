
const CoreObject = require('./core_object');
const CoreCountry = require('./core_country')
const { QueryTypes } = require('sequelize');


class CoreBusiness extends CoreObject {
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
				country_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					foreignKey: true,
					unique: 'country_fiscal_code',
					references: {
						model: CoreCountry,
						key: 'id'
					},
					field: 'country_id'
				},
				fiscal_code: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: 'country_fiscal_code',
					field: 'fiscal_code'
				},
				url_name: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true,
					field: 'url_name'
				},
				trade_name: {
					type: DataTypes.STRING,
					allowNull: false,
					field: 'trade_name'
				},
				register_name: {
					type: DataTypes.STRING,
					allowNull: false,
					field: 'register_name'
				}
			},
			{
				sequelize,
				modelName: 'CoreBusiness',
				tableName: 'core_business',
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

module.exports = CoreBusiness;
