
const core_ctrl_get_country = (req, res) => {
	const { ht_data, ...rest } = req.country.get({ plain: true });
	return res.status(200).json({ country: rest });
}


const core_ctrl_get_countries = (req, res) => {
	const v_countries = req.countries.map(c => {
		const { ht_data, ...rest } = c.get({ plain: true });
		return rest;
	});
	return res.status(200).json({ countries: v_countries });
}


module.exports = {
	core_ctrl_get_country,
	core_ctrl_get_countries
}