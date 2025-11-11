
const createCountries = require('./CoreCountry/CreateCoreCountries.js');
const createProducts = require('./CoreProduct/CreateCoreProducts.js');
const createUsers = require('./CoreUser/CreateCoreUsers.js');
const createBusinesses = require('./CoreBusiness/CreateCoreBusinesses.js');


module.exports = async function (sequelize) {
	// Run seeders sequentially and add explicit delays where needed.
	await createCountries();
	await createUsers();

	// Small delay before creating businesses (keeps original intent of a 300ms wait)
	await new Promise((resolve) => setTimeout(resolve, 300));
	await createBusinesses();

	// Add an explicit delay BEFORE running createProducts as requested.
	await new Promise((resolve) => setTimeout(resolve, 300));
	await createProducts(sequelize);
};
