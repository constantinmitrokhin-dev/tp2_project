
const { loader_build_countries_from_files } = require("../../../../../loader/index.js");


module.exports = async function () {
	const countriesArray = await loader_build_countries_from_files();
	const CoreCountry = require('../../models/core_country.js');
	countriesArray.forEach(e => { CoreCountry.create({ ...e });	});
}
