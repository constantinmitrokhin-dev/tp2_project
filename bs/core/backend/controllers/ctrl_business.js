
const core_ctrl_register_business = (req, res) => {
	const { ht_data, ...rest } = req.registeredBusiness.get({ plain: true });
	return res.status(201).json({
		status: 201,
		message: 'Business registered successfully',
		business: rest
	});
};


const core_ctrl_get_business = (req, res) => {
	const { ht_data, ...rest } = req.business.get({ plain: true });
	return res.status(200).json({
		status: 200,
		business: rest
	});
};


module.exports = {
	core_ctrl_register_business,
	core_ctrl_get_business
};


