
const { Op } = require('sequelize');
const CoreProduct = require('../models/core_product');


///* Find every valid CoreProduct by business_id
const core_svc_product_find_by_business_id_and_date = async (p_business_id, p_valid_until = new Date()) => {
	return await CoreProduct.findAll({
		where: {
			business_id: p_business_id,
			[Op.or]: [
				{ valid_until: null },
				{ valid_until: { [Op.gt]: p_valid_until } }
			]
		}
	});
}


///* Find every invalid CoreProduct by business_id
const core_svc_product_find_all_inactive_by_business_and_date = async (p_business_id, p_valid_until = new Date()) => {
	return await CoreProduct.findAll({
		where: {
			business_id: p_business_id,
			valid_until: { [Op.lte]: p_valid_until }
		}
	});
}


//* Find a CoreProduct by its primary key (ID)
const core_svc_product_find_by_id = async (p_product_id) => {
	return await CoreProduct.findByPk(p_product_id);
}


//* Find CoreProducts by text in name, code, or description
const core_svc_product_find_by_text = async (p_business_id, p_text) => {
	return await CoreProduct.findAll({
		where: {
			business_id: p_business_id,
			[Op.or]: [
				{ name:        { [Op.iLike]: `%${p_text}%` } },
				{ code:        { [Op.iLike]: `%${p_text}%` } },
				{ description: { [Op.iLike]: `%${p_text}%` } }
			]
		}
	});
}


//* Find CoreProducts by exact name
const core_svc_product_find_by_name = async (p_business_id, p_type_id, p_name) => {
	return await CoreProduct.findOne({
		where: {
			business_id: p_business_id,
			type_id:     p_type_id,
			name:        p_name
		}
	});
}


//* Create a new CoreProduct record with the provided data
const core_svc_product_create = async (p_type_id, p_business_id, p_name, p_valid_until = null, p_code, p_description, p_price) => {
	return await CoreProduct.create(
		{
			type_id:     p_type_id,
			business_id: p_business_id,
			name:        p_name,
			valid_until: p_valid_until,
			code:        p_code,
			description: p_description,
			price:       p_price
		});
}


//* Update an existing CoreProduct’s
const core_svc_product_update = async (p_product) => {
	return await p_product.save();
}


//* Soft-delete a CoreProduct by setting its valid_until to current Date
const core_svc_product_delete = async (p_product) => {
	p_product.valid_until = new Date();
	return await p_product.save();
}


module.exports = {
	core_svc_product_find_by_business_id_and_date,
	core_svc_product_find_all_inactive_by_business_and_date,
	core_svc_product_find_by_id,
	core_svc_product_find_by_text,
	core_svc_product_find_by_name,
	core_svc_product_create,
	core_svc_product_update,
	core_svc_product_delete
}
