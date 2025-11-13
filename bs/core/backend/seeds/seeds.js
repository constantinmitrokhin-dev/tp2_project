
const createCountries = require('./CoreCountry/CreateCoreCountries.js');
const createProducts = require('./CoreProduct/CreateCoreProducts.js');
const createUsers = require('./CoreUser/CreateCoreUsers.js');
const createBusinesses = require('./CoreBusiness/CreateCoreBusinesses.js');
const createUserBusiness = require('./CoreUserBusiness/CreateCoreUserBusiness.js');

module.exports = async function (sequelize) {
	//
	await createCountries();
	await new Promise((resolve) => setTimeout(resolve, 200));

	//
	await createUsers();
	await new Promise((resolve) => setTimeout(resolve, 300));

	await createBusinesses();
	await new Promise((resolve) => setTimeout(resolve, 300));

	//
	await createProducts(sequelize);
	await new Promise((resolve) => setTimeout(resolve, 300));

	//
	await createUserBusiness();
	await new Promise((resolve) => setTimeout(resolve, 300));

};
