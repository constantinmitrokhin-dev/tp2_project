
const CoreObject = require('./core_object');
const { QueryTypes } = require('sequelize');


class CoreCountry extends CoreObject {
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
					unique: true,
					field: 'name'
				},
				iso3: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true,
					field: 'iso3'
				},
				iso2: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true,
					field: 'iso2'
				},
				currency: {
					type: DataTypes.STRING,
					allowNull: false,
					field: 'currency'
				},
				currency_name: {
					type: DataTypes.STRING,
					allowNull: false,
					field: 'currency_name'
				},
				currency_symbol: {
					type: DataTypes.STRING,
					allowNull: false,
					field: 'currency_symbol'
				},
				tld: {
					type: DataTypes.STRING,
					allowNull: false,
					field: 'tld'
				},
				phone_code: {
					type: DataTypes.STRING,
					allowNull: false,
					field: 'phone_code'
				}
			},
			{
				sequelize,
				modelName: 'CoreCountry',
				tableName: 'core_country',
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

module.exports = CoreCountry;
