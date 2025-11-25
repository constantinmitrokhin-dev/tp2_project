
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
	return res.status(req.status).json({ business: rest, status });
}


const core_ctrl_get_business_with_locations = (req, res) => {
	const { ht_data, ...rest } = req.business.get({ plain: true });
	if (rest.businessLocation && Array.isArray(rest.businessLocation)) {
		rest.businessLocation = rest.businessLocation.map(loc => {
			const { id, ht_data, ...cleanedLoc } = loc;
			return cleanedLoc;
		});
	}
	return res.status(req.status).json({ business: rest });
}


module.exports = {
	core_ctrl_get_business,
	core_ctrl_get_business_with_locations
};
