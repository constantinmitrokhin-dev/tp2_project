const { DataTypes, Model } = require("sequelize");

class CoreObject extends Model {
	static commonAttributes() {
		return {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				field: 'id'
			},
			ht_data: {
				type: DataTypes.JSONB,
				allowNull: false,
				field: 'ht_data'
			}
		};
	}
}

module.exports = (sequelize) => {
	CoreObject.init(
		CoreObject.commonAttributes(),
		{
			sequelize,
			modelName: 'CoreObject',
			tableName: 'core_object',
			timestamps: false,
		}
	);
	return CoreObject;
};