
const { Op } = require('sequelize');
const CoreProductType = require('../models/core_product_type');


///* Find every valid CoreProductType by business_id
const core_svc_product_type_find_by_business_id = async (p_business_id) => {
	return await CoreProductType.findAll({
		where: {
			business_id: p_business_id
		}
	});
}



//* Find a CoreProductType by its primary key (ID)
const core_svc_product_type_find_by_id = async (p_product_type_id) => {
	return await CoreProductType.findByPk(p_product_type_id);
}


//* Find CoreProductTypes by text in name, code, or description
const core_svc_product_type_find_by_text = async (p_business_id, p_text) => {
	return await CoreProductType.findAll({
		where: {
			business_id: p_business_id,
			[Op.or]: [
				{ name:        { [Op.iLike]: `%${p_text}%` } },
				{ kind:        { [Op.iLike]: `%${p_text}%` } }
			]
		}
	});
}


//* Find CoreProductTypes by exact name
const core_svc_product_type_find_by_name_and_kind = async (p_name, p_kind, p_business_id) => {
	return await CoreProductType.findOne({
		where: {
			name:        p_name,
			kind:        p_kind,
			business_id: p_business_id
		}
	});
}


//* Create a new CoreProductType record with the provided data
const core_svc_product_type_create = async (p_name, p_kind, p_business_id) => {
	return await CoreProductType.create(
		{
			name:        p_name,
			kind:        p_kind,
			business_id: p_business_id
		});
}


//* Update an existing CoreProductType’s
const core_svc_product_type_update = async (p_product_type) => {
	return await p_product_type.save();
}


//* Delete a CoreProductType
const core_svc_product_type_delete = async (p_product_type) => {
	return await p_product_type.destroy();
}


module.exports = {
	core_svc_product_type_find_by_business_id,
	core_svc_product_type_find_by_id,
	core_svc_product_type_find_by_text,
	core_svc_product_type_find_by_name_and_kind,
	core_svc_product_type_create,
	core_svc_product_type_update,
	core_svc_product_type_delete
}
