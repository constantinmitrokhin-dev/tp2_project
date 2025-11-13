
const CoreType = require('./core_type');
const { ERR_NOT_NULL } = require('./utils/msgs_error');


class CoreStateType extends CoreType {
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
					validate: {
						notNull: {
							msg: `core_state_type.name: ${ERR_NOT_NULL}`
						}
					},
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
					allowNull: false,
					unique: 'kind_name_business_id',
					validate: {
						notNull: {
							msg: `core_state_type.business_id: ${ERR_NOT_NULL}`
						}
					},
					field: 'business_id'
				}
			},
			{
				sequelize,
				modelName: 'CoreStateType',
				tableName: 'core_state_type',
				timestamps: false,
				relationships: {
					type: 'inheritance',
					parent: CoreType,
					foreignKey: 'id'
				},
				hooks: {
					beforeValidate: async (instance, options) => {
						const txOpt = options?.transaction ? { transaction: options.transaction } : {};
						try {
							const parent = await CoreType.create({name: instance.name, kind: instance.kind, business_id: instance.business_id}, txOpt);

							if (!parent) throw new Error('No se pudo crear core_type');
							instance.id          = parent.id;
							instance.ht_data     = parent.ht_data;
							instance.name        = parent.name;
							instance.kind        = parent.kind;
							instance.business_id = parent.business_id;
						} catch (error) {
							console.error('Error creando CoreType para CoreStateType:', error);
							throw new Error('Error creando CoreType para CoreStateType:');
						}
					}
				}
			}
		);
	}
}


module.exports = CoreStateType;
