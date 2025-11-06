const CoreObject = require('./core_object');
const CoreCountry = require('./core_country');
const CoreType = require('./core_type');
const CoreBusiness = require('./core_business');
const CoreBusinessLocation = require('./core_business_location');
const CoreProductType = require('./core_product_type');
const CoreProduct = require('./core_product');


async function core_mod_define_models(sequelize, DataTypes) {
	// 1. Inicializar todos los modelos primero
	CoreObject.initModel(sequelize, DataTypes);
	CoreCountry.initModel(sequelize, DataTypes);
	CoreType.initModel(sequelize, DataTypes);
	CoreBusiness.initModel(sequelize, DataTypes);
	CoreBusinessLocation.initModel(sequelize, DataTypes);
	CoreProductType.initModel(sequelize, DataTypes);
	CoreProduct.initModel(sequelize, DataTypes);

	// 2. Definir relaciones de herencia (uno a uno, mismo id)
	CoreObject.hasOne(CoreCountry, { foreignKey: 'id', as: 'country' });
	CoreCountry.belongsTo(CoreObject, { foreignKey: 'id', as: 'coreObject' });

	CoreObject.hasOne(CoreType, { foreignKey: 'id', as: 'type' });
	CoreType.belongsTo(CoreObject, { foreignKey: 'id', as: 'coreObject' });

	CoreObject.hasOne(CoreBusiness, { foreignKey: 'id', as: 'business' });
	CoreBusiness.belongsTo(CoreObject, { foreignKey: 'id', as: 'coreObject' });

	CoreObject.hasOne(CoreBusinessLocation, { foreignKey: 'id', as: 'businessLocation' });
	CoreBusinessLocation.belongsTo(CoreObject, { foreignKey: 'id', as: 'coreObject' });

	CoreType.hasOne(CoreProductType, { foreignKey: 'id', as: 'productType' });
	CoreProductType.belongsTo(CoreType, { foreignKey: 'id', as: 'coreType' });

	CoreObject.hasOne(CoreProduct, { foreignKey: 'id', as: 'product' });
	CoreProduct.belongsTo(CoreObject, { foreignKey: 'id', as: 'coreObject' });

	// 3. Relaciones adicionales del diagrama
	CoreBusiness.belongsTo(CoreCountry, { foreignKey: 'country_id', as: 'country' });
	CoreCountry.hasMany(CoreBusiness, { foreignKey: 'country_id', as: 'businesses' });

	CoreBusiness.hasMany(CoreBusinessLocation, { foreignKey: 'business_id', as: 'locations' });
	CoreBusinessLocation.belongsTo(CoreBusiness, { foreignKey: 'business_id', as: 'business' });

	CoreProductType.hasMany(CoreProduct, { foreignKey: 'type_id', as: 'products' });
	CoreProduct.belongsTo(CoreProductType, { foreignKey: 'type_id', as: 'type' });

	// 4. Retornar modelos
	return {
		CoreObject,
		CoreCountry,
		CoreType,
		CoreBusiness,
		CoreBusinessLocation,
		CoreProductType,
		CoreProduct
	};
}


module.exports = { core_mod_define_models };
