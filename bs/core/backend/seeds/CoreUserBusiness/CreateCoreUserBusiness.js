
const CoreUser  = require("../../models/core_user.js");
const CoreBusiness = require('../../models/core_business.js');
const CoreUserBusiness = require('../../models/core_user_business.js');


module.exports = async function () {
    const user = await CoreUser.findOne({ where: {user_name: 'c_p'} });
	const bs = await CoreBusiness.findOne({ where: {url_name: 'la_espiga'} });

    const users_businesses = [
        {
            user_id: user.id,
			business_id: bs.id,
			role: 'Supreme Overlord'
        }
    ]

	users_businesses.forEach(e => { CoreUserBusiness.create({ ...e }); });

}