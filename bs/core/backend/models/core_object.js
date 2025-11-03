
const { Model } = require('sequelize');


class CoreObject extends Model {
	static initModel(sequelize, DataTypes) {
		super.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
					field: 'id'
				},
				ht_data: {
					type: 'ht_data',
					allowNull: false,
					defaultValue: sequelize.literal(
						`ROW(txid_current(), NOW(), 'infinity'::timestamptz)::ht_data`
					),
					field: 'ht_data'
				}
			},
			{
				sequelize,
				modelName: 'CoreObject',
				tableName: 'core_object',
				timestamps: false
			}
		);
	}
}


module.exports = CoreObject;
