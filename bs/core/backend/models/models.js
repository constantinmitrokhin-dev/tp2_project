
const CoreObject = require('./core_object');
const CoreCountry = require('./core_country');
const CoreType = require('./core_type');
const CoreBusiness = require('./core_business');
const CoreUser = require('./core_user');


async function defineModels(sequelize, DataTypes) {
	// 1. Inicializar todos los modelos primero
	CoreObject.initModel(sequelize, DataTypes);
	CoreCountry.initModel(sequelize, DataTypes);
	CoreType.initModel(sequelize, DataTypes);
	CoreBusiness.initModel(sequelize, DataTypes);
	CoreUser.initModel(sequelize, DataTypes);

	// 2. Definir relaciones de herencia (uno a uno, mismo id)
	CoreObject.hasOne(CoreCountry, { foreignKey: 'id', as: 'country' });
	CoreCountry.belongsTo(CoreObject, { foreignKey: 'id', as: 'coreObject' });

	CoreObject.hasOne(CoreType, { foreignKey: 'id', as: 'type' });
	CoreType.belongsTo(CoreObject, { foreignKey: 'id', as: 'coreObject' });

	CoreObject.hasOne(CoreBusiness, { foreignKey: 'id', as: 'business' });
	CoreBusiness.belongsTo(CoreObject, { foreignKey: 'id', as: 'coreObject' });

	CoreObject.hasOne(CoreUser, { foreignKey: 'id', as: 'user' });
	CoreUser.belongsTo(CoreObject, { foreignKey: 'id', as: 'coreObject' });

	// 3. Relaciones adicionales del diagrama
	CoreBusiness.belongsTo(CoreCountry, { foreignKey: 'country_id', as: 'country' });
	CoreCountry.hasMany(CoreBusiness, { foreignKey: 'country_id', as: 'businesses' });

	// 4. Retornar modelos
	return {
		CoreObject,
		CoreCountry,
		CoreType,
		CoreBusiness,
		CoreUser,
	};
}


module.exports = { defineModels };
