const CoreObject = require('./core_object');
const { QueryTypes } = require('sequelize');
const CoreProductType = require('./core_product_type');
const CoreBusiness = require('./core_business');
const { PRODUCT_PRICE_MIN } = require('./utils/constants');
const { ERR_NOT_NULL, ERR_IS_NUMERIC, ERR_PRODUCT_PRICE_MIN } = require('./utils/msgs_error');


class CoreProduct extends CoreObject {
	static initModel(sequelize, DataTypes) {
		super.init(
			{
				id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
					foreignKey: true,
					references: {
						model: CoreObject,
						key: 'id'
					},
					field: 'id'
				},
				ht_data: {
					type: 'ht_data', // tipo personalizado en la DB
					allowNull: false,
					field: 'ht_data'
				},
				type_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					validate: {
						notNull: {
							msg: `core_product.type_id: ${ERR_NOT_NULL}`
						}
					},
					field: 'type_id',
					references: {
						model: CoreProductType,
						key: 'id'
					}
				},
				business_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					validate: {
						notNull: {
							msg: `core_product.business_id: ${ERR_NOT_NULL}`
						}
					},
					field: 'business_id',
					references: {
						model: CoreBusiness,
						key: 'id'
					}
				},
				name: {
					type: DataTypes.STRING,
					allowNull: false,
					validate: {
						notNull: {
							msg: `core_product.name: ${ERR_NOT_NULL}`
						}
					},
					field: 'name'
				},
				valid_until: {
					type: DataTypes.DATE, // TIMESTAMPTZ
					allowNull: true,
					field: 'valid_until',
					defaultValue: null
				},
				code: {
					type: DataTypes.STRING,
					allowNull: true,
					field: 'code'
				},
				description: {
					type: DataTypes.TEXT,
					allowNull: true,
					field: 'description'
				},
				price: {
					type: DataTypes.REAL,
					allowNull: true,
					field: 'price',
					validate: {
						 isNumeric: {
							msg: `core_product.price: ${ERR_IS_NUMERIC}`
						},
						min: {
							args: PRODUCT_PRICE_MIN,
							msg: ERR_PRODUCT_PRICE_MIN
						}
					}
				}
			},
			{
				sequelize,
				modelName: 'CoreProduct',
				tableName: 'core_product',
				timestamps: false,
				relationships: {
					type: 'inheritance',
					parent: CoreObject,
					foreignKey: 'id'
				},
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
	}
}

module.exports = CoreProduct;