
const CoreCountry = require('../../models/core_country.js');
const CoreBusiness = require('../../models/core_business.js');
const { Op } = require('sequelize');


module.exports = async function () {
	const country1 = await CoreCountry.findOne({ where: {name: { [Op.iLike]: '%argentina%' }} });
	const country2 = await CoreCountry.findOne({ where: {name: { [Op.iLike]: '%united states%' }} });

	if (!country1 || !country2) {
		throw new Error('Faltan países en la tabla core_country (Argentina o United States)');
	}

	const businessArray = [
		{
			country_id: country1.id,
			fiscal_code: '30-70856789-9',
			url_name: 'la_espiga',
			trade_name: 'Panadería La Espiga',
			register_name: 'La Espiga S.R.L.'
		},
		{
			country_id: country2.id,
			fiscal_code: '84-1234567',
			url_name: 'sunny_bites',
			trade_name: 'Sunny Bites Bakery',
			register_name: 'Sunny Bites LLC'
		},
	]
	businessArray.forEach(e => { CoreBusiness.create({ ...e }); });
}
