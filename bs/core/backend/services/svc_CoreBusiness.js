
const { Op } = require('sequelize');
const CoreBusiness = require('../models/core_business');


//* Find a CoreBusiness by its primary key (ID)
const core_svc_business_find_by_id = async (p_business_id) => {
	return await CoreBusiness.findByPk(p_business_id);
}


//* Find CoreBusinesss by exact url_name
const core_svc_business_find_by_url_name = async (p_url_name) => {
	return await CoreBusiness.findOne({
		where: {
			url_name: p_url_name
		}
	});
}


//* Create a new CoreBusiness record with the provided data
const core_svc_business_create = async (p_country_id, p_fiscal_code, p_url_name, p_trade_name, p_register_name) => {
	return await CoreBusiness.create(
		{
			country_id:    p_country_id,
			fiscal_code:   p_fiscal_code,
			url_name:      p_url_name,
			trade_name:    p_trade_name,
			register_name: p_register_name
		});
}


module.exports = {
	core_svc_business_find_by_id,
	core_svc_business_find_by_url_name,
	core_svc_business_create
}
