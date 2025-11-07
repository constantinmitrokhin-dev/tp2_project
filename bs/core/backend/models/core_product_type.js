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
                }, 
                name: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: 'kind_name_business_id',
					field: 'name'
				},
				kind: {
					type: DataTypes.STRING,
					allowNull: true,
					unique: 'kind_name_business_id',
					field: 'kind'
				},
				business_id: {
					type: DataTypes.INTEGER,
					allowNull: true,
					unique: 'kind_name_business_id',
					field: 'business_id'
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

                        const [parent] = await sequelize.query(
                            `INSERT INTO core_type (name, business_id, kind) 
                             VALUES ($name, $business_id, $kind) 
                             RETURNING id, ht_data, name, business_id, kind`,
                            { 
                                type: QueryTypes.SELECT,
                                bind: {
                                    name: instance.name,
                                    business_id: instance.business_id,
                                    kind: instance.kind
                                },
                                ...txOpt 
                            },
                        );

                        if (!parent) throw new Error('No se pudo crear core_type');

                        instance.id = parent.id;
                        instance.ht_data = parent.ht_data;
                        instance.name = parent.name;
                        instance.business_id = parent.business_id;
                        instance.kind = parent.kind;
                    }
                }
            }
        );
    }
}

module.exports = CoreProductType;