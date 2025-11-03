
const {Router} = require('express');
const router = Router();
const CoreUserRoutes = require('./CoreUser/CoreUserRoutes');


// Mount routes
	//* User - Services
router.use('/user', CoreUserRoutes);


module.exports = router;
