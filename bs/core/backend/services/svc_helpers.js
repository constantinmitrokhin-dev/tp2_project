
const { Sequelize } = require('sequelize');


const core_svc_address_type_build = async (p_address) => {
	return await Sequelize.literal(
		`ROW(${[
			p_address.country_id ?? 'NULL',
			p_address.state_id ?? 'NULL',
			p_address.city ? `'${p_address.city}'` : 'NULL',
			p_address.neighborhood ? `'${p_address.neighborhood}'` : 'NULL',
			p_address.street ? `'${p_address.street}'` : 'NULL',
			p_address.number ? `'${p_address.number}'` : 'NULL',
			p_address.floor ? `'${p_address.floor}'` : 'NULL',
			p_address.unit ? `'${p_address.unit}'` : 'NULL',
			p_address.additional ? `'${p_address.additional}'` : 'NULL',
			p_address.postal_code ? `'${p_address.postal_code}'` : 'NULL',
			p_address.between_street_1 ? `'${p_address.between_street_1}'` : 'NULL',
			p_address.between_street_2 ? `'${p_address.between_street_2}'` : 'NULL'
		].join(', ')})::address`
	);

};


module.exports = {
	core_svc_address_type_build
}
