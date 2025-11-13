
const core_ctrl_get_state = (req, res) => {
	const { ht_data, ...rest } = req.state.get({ plain: true });
	return res.status(200).json({ state: rest });
}


const core_ctrl_get_states = (req, res) => {
	const v_states = req.states.map(c => {
		const { ht_data, ...rest } = c.get({ plain: true });
		return rest;
	});
	return res.status(200).json({ states: v_states });
}


module.exports = {
	core_ctrl_get_state,
	core_ctrl_get_states
}