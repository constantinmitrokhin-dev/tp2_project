const CoreType = require('./core_type');
const { QueryTypes } = require('sequelize');

class CoreProductType extends CoreType {
    static initModel(sequelize, DataTypes) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    foreignKey: true,
                    references: {
                        model: CoreType,
                        key: 'id'
                    },
                    field: 'id'
                },
                ht_data: {
                    type: 'ht_data',
                    allowNull: false,
                    field: 'ht_data'
                }
            },
            {
                sequelize,
                modelName: 'CoreProductType',
                tableName: 'core_product_type',
                timestamps: false,
                relationships: {
                    type: 'inheritance',
                    parent: CoreType,
                    foreignKey: 'id'
                },
                hooks: {
                    beforeValidate: async (instance, options) => {
                        const txOpt = options?.transaction ? { transaction: options.transaction } : {};

                        // Set kind value for product types
                        instance.kind = 'PRODUCT';

                        const [parent] = await sequelize.query(
                            `INSERT INTO core_type (kind, business_id, name) 
                             VALUES ($kind, $business_id, $name) 
                             RETURNING id, ht_data`,
                            { 
                                bind: {
                                    kind: instance.kind,
                                    business_id: instance.business_id,
                                    name: instance.name
                                },
                                type: QueryTypes.SELECT,
                                ...txOpt 
                            }
                        );

                        if (!parent) throw new Error('No se pudo crear core_type');

                        instance.id = parent.id;
                        instance.ht_data = parent.ht_data;
                    }
                }
            }
        );
    }
}

module.exports = CoreProductType;