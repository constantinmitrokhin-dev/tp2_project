
const CoreState = require('../../models/core_state.js');
const CoreStateType = require('../../models/core_state_type.js');
const CoreCountry = require('../../models/core_country.js')
const { loader_build_states_from_files } = require('../../../../../loader/index.js');


module.exports = async function (sequelize) {
	const statesArray = await loader_build_states_from_files();
	statesArray.sort((a, b) => a.type.localeCompare(b.type));

	let stateType = null;
	for (let i = 0; i < statesArray.length; i++) {
		const state = statesArray[i];
		if((!stateType || stateType.name !== state.type) && state.type !== undefined){
			await sequelize.transaction(async (t) => {
				stateType = await CoreStateType.create(
					{name: `${state.type}`},
					{transaction: t}
				);
			});
		};
		const country = await CoreCountry.findOne({ where: { name: state.country_name } });

		const newState = CoreState.create({
			country_id: country.id,
			type_id: stateType.id,
			name: state.name,
			iso3: state.iso3,
			iso2: state.iso2
		});
	}
}
