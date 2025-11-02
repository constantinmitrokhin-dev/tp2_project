
const createCountries = require('./CoreCountry/CreateCoreCountries.js');

module.exports = async function () {
	await Promise.all([
		await createCountries()
	]);
}
