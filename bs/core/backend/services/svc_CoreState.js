
const CoreState = require('../models/core_state');
const CoreStateType = require('../models/core_state_type');


///* Find every valid CoreState
const core_svc_state_get_all_by_country_id = async (p_country_id) => {
	return await CoreState.findAll({
		where : { country_id: p_country_id },
		include: [
			{
				model: CoreStateType,
				as: 'state_type',
			}
		]
	});
}


//* Find a CoreState by its primary key (ID)
const core_svc_state_find_by_id = async (p_country_id) => {
	return await CoreState.findByPk(p_country_id,
		{
			include: [
			{
				model: CoreStateType,
				as: 'state_type',
			}
		]});
}


//* Find CoreStates by text in name
const core_svc_state_find_by_text = async (p_country_id, p_text) => {
	return await CoreState.findAll({
		where: {
			country_id: p_country_id,
			[Op.or]: [
				{ name: { [Op.iLike]: `%${p_text}%` } },
			]
		},
		include: [
			{
				model: CoreStateType,
				as: 'state_type',
			}
		]
	});
}


module.exports = {
	core_svc_state_get_all_by_country_id,
	core_svc_state_find_by_id,
	core_svc_state_find_by_text
}
