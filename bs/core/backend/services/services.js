
// Entry point for backend services

// User services
const {
	core_svc_user_find_active_by_user_name_or_email,
	core_svc_user_find_by_id,
	core_svc_user_create,
	core_svc_user_update,
	core_svc_user_delete
} = require('./svc_CoreUser');

// Country services
const {
	core_svc_country_get_all,
	core_svc_country_find_by_id,
	core_svc_countries_find_by_text,
	core_svc_country_find_by_name
} = require('./svc_CoreCountry');

// Business services
const {
	core_svc_business_find_by_id,
	core_svc_business_find_by_url_name,
	core_svc_business_create
} = require('./svc_CoreBusiness');

// Business Location services
const {
	core_svc_business_location_find_by_id,
	core_svc_business_locations_find_by_business_id,
	core_svc_business_location_create
} = require('./svc_CoreBusinessLocation');

// Product services
const {
	core_svc_product_find_by_business_id_and_date,
	core_svc_product_find_all_inactive_by_business_and_date,
	core_svc_product_find_by_id,
	core_svc_product_find_by_text,
	core_svc_product_find_by_name,
	core_svc_product_create,
	core_svc_product_update,
	core_svc_product_delete
} = require('./svc_CoreProduct');

// Product Type services
const {
	core_svc_product_type_find_by_business_id,
	core_svc_product_type_find_by_id,
	core_svc_product_type_find_by_text,
	core_svc_product_type_find_by_name_and_kind,
	core_svc_product_type_create,
	core_svc_product_type_update,
	core_svc_product_type_delete
} = require('./svc_CoreProductType');

// Helper services
const {
	core_svc_address_type_build
} = require('./svc_helpers');


module.exports = {
	// User services
	core_svc_user_find_active_by_user_name_or_email,
	core_svc_user_find_by_id,
	core_svc_user_create,
	core_svc_user_update,
	core_svc_user_delete,

	// Country services
	core_svc_country_get_all,
	core_svc_country_find_by_id,
	core_svc_countries_find_by_text,
	core_svc_country_find_by_name,

	// Business services
	core_svc_business_find_by_id,
	core_svc_business_find_by_url_name,
	core_svc_business_create,

	// Business Location services
	core_svc_business_location_find_by_id,
	core_svc_business_locations_find_by_business_id,
	core_svc_business_location_create,

	// Product services
	core_svc_product_find_by_business_id_and_date,
	core_svc_product_find_all_inactive_by_business_and_date,
	core_svc_product_find_by_id,
	core_svc_product_find_by_text,
	core_svc_product_find_by_name,
	core_svc_product_create,
	core_svc_product_update,
	core_svc_product_delete,

	// Product Type services
	core_svc_product_type_find_by_business_id,
	core_svc_product_type_find_by_id,
	core_svc_product_type_find_by_text,
	core_svc_product_type_find_by_name_and_kind,
	core_svc_product_type_create,
	core_svc_product_type_update,
	core_svc_product_type_delete,

	// Helper services
	core_svc_address_type_build
};