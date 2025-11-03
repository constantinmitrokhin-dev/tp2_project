
const CoreObject = require('./core_object');
const CoreCountry = require('./core_country');
const CoreType = require('./core_type');
const CoreBusiness = require('./core_business');


async function defineModels(sequelize, DataTypes) {
		// Definir todos los modelos aquí
		await CoreObject.initModel(sequelize, DataTypes);
		await CoreCountry.initModel(sequelize, DataTypes);

		CoreObject.hasOne(CoreCountry, { foreignKey: 'id' });
		CoreCountry.belongsTo(CoreObject, { foreignKey: 'id' });

		await CoreType.initModel(sequelize, DataTypes);

		CoreObject.hasOne(CoreType, { foreignKey: 'id' });
		CoreType.belongsTo(CoreObject, { foreignKey: 'id' });

		await CoreBusiness.initModel(sequelize, DataTypes);

		CoreObject.hasOne(CoreBusiness, { foreignKey: 'id' });
		CoreBusiness.belongsTo(CoreObject, { foreignKey: 'id' });
		CoreCountry.belongsTo(CoreBusiness, { foreignKey: 'country_id' })

}


module.exports = {
	defineModels
};
