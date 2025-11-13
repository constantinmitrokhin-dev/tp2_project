
const { Op } = require('sequelize');
const CoreCountry = require('../models/core_country');


///* Find every valid CoreCountry
const core_svc_country_get_all = async () => {
	return await CoreCountry.findAll();
}


//* Find a CoreCountry by its primary key (ID)
const core_svc_country_find_by_id = async (p_country_id) => {
	return await CoreCountry.findByPk(p_country_id);
}


//* Find CoreCountrys by text in name
const core_svc_countries_find_by_text = async (p_text) => {
	return await CoreCountry.findAll({
		where: {
			[Op.or]: [
				{ name: { [Op.iLike]: `%${p_text}%` } },
			]
		}
	});
}


//* Find CoreCountrys by text in name, code, or description
const core_svc_country_find_by_name = async (p_name) => {
	return await CoreCountry.findOne({
		where: {
			name: p_name
		}
	});
}


module.exports = {
	core_svc_country_get_all,
	core_svc_country_find_by_id,
	core_svc_countries_find_by_text,
	core_svc_country_find_by_name
}
