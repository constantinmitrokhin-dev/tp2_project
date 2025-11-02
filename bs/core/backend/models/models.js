
const CoreObject = require('./core_object');
const CoreCountry = require('./core_country');


async function defineModels(sequelize, DataTypes) {
		// Definir todos los modelos aquí
		await CoreObject.initModel(sequelize, DataTypes);
		await CoreCountry.initModel(sequelize, DataTypes);

		CoreObject.hasOne(CoreCountry, { foreignKey: 'id' });
		CoreCountry.belongsTo(CoreObject, { foreignKey: 'id' });

}


module.exports = {
	defineModels
};

