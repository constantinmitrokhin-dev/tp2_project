const CoreObject = require('./core_object');
const { QueryTypes } = require('sequelize');
const CoreProductType = require('./core_product_type');
const CoreBusiness = require('./core_business');

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
                    field: 'type_id',
                    references: {
                        model: CoreProductType,
                        key: 'id'
                    }
                },
                business_id: {
                    type: DataTypes.INTEGER,  
                    allowNull: false,
                    field: 'business_id',
                    references: {
                        model: CoreBusiness,
                        key: 'id'
                    }
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    field: 'name'
                },
                valid_until: {
                    type: DataTypes.DATE, // TIMESTAMPTZ
                    allowNull: true,
                    field: 'valid_until'
                },
                code: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    field: 'code'
                },
                price: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                    field: 'price',
                    validate: {
                        isDecimal: { msg: 'El precio debe ser numérico' },
                        isPositive(value) {
                            if (value == null) return; // permitir null si la columna lo permite
                            if (Number(value) <= 0) {
                                throw new Error('El precio debe ser un número positivo');
                            }
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