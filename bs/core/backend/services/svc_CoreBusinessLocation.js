
const { Op } = require('sequelize');
const CoreBusinessLocation = require('../models/core_business_location');
const { core_svc_address_type_build } = require('./svc_helpers');


//* Find a CoreBusinessLocation by its primary key (ID)
const core_svc_business_location_find_by_id = async (p_business_loc_id) => {
	return await CoreBusinessLocation.findByPk(p_business_loc_id);
}


//* Find CoreBusinessLocations by exact business_id
const core_svc_business_locations_find_by_business_id = async (p_business_id) => {
	return await CoreBusinessLocation.findAll({
		where: {
			business_id: p_business_id
		}
	});
}


//* Create a new CoreBusinessLocation record with the provided data
const core_svc_business_location_create = async (p_business_id, p_name, p_address) => {
	let address_data_type = await core_svc_address_type_build(p_address);
	return await CoreBusinessLocation.create(
		{
			business_id: p_business_id,
			name:        p_name,
			address:     address_data_type
		});
}


module.exports = {
	core_svc_business_location_find_by_id,
	core_svc_business_locations_find_by_business_id,
	core_svc_business_location_create
}
