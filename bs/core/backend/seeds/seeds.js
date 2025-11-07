
const createCountries = require('./CoreCountry/CreateCoreCountries.js');
const createProducts = require('./CoreProduct/CreateCoreProducts.js');

module.exports = async function () {
	await Promise.all([
		await createCountries(),
		// await createProducts()

	]);
}
