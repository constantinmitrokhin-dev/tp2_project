
const {
	core_svc_state_get_all_by_country_id,
	core_svc_state_find_by_id,
	core_svc_state_find_by_text } = require('../services/svc_CoreState');
const {
	MDLW_ERR_STATE_ID_NOT_FOUND,
	MDLW_ERR_STATES_NOT_FOUND } = require('./utils/msgs_error');


const core_mdlw_validate_state_id = async (req, res, next) => {
	try {
		const v_state = await core_svc_state_find_by_id(req.validatedId);
		if (!v_state) {
			return res.status(404).json({
				status: 404,
				message: MDLW_ERR_STATE_ID_NOT_FOUND
			});
		}
		req.state = v_state;
		next();
	} catch (error) {
		next(error);
	}
};


const core_mdlw_validate_states = async (req, res, next) => {
	try {
		const v_country_id = req.country.id;
		const v_states = await core_svc_state_get_all_by_country_id(v_country_id);
		if (!v_states) {
			return res.status(404).json({
				status: 404,
				message: MDLW_ERR_STATES_NOT_FOUND
			});
		}
		req.states = v_states;
		next();
	} catch (error) {
		next(error);
	}
};


const core_mdlw_validate_state_by_text = async (req, res, next) => {
	try {
		const v_country_id = req.country.id;
		const v_states = await core_svc_state_find_by_text(v_country_id, req.validatedText);
		if (!v_states) {
			return res.status(404).json({
				status: 404,
				message: MDLW_ERR_STATES_NOT_FOUND
			});
		}
		req.states = v_states;
		next();
	} catch (error) {
		next(error);
	}
};

module.exports = {
	core_mdlw_validate_state_id,
	core_mdlw_validate_states,
	core_mdlw_validate_state_by_text
}
