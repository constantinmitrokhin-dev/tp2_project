
const { Router } = require('express');
const router = Router();
const CoreUserRoutes = require('./CoreUser/CoreUserRoutes');
const CoreCoutryRoutes = require('./CoreCoutry/CoreCountryRoutes');
const CoreBusinessRoutes = require('./CoreBusiness/CoreBusinessRoutes');
const CoreProductTypeRoutes = require('./CoreProductType/CoreProductTypeRoutes');
const CoreBusinessLocationRoutes = require('./CoreBusinessLocation/CoreBusinessLocationRoutes');
const CoreProductRoutes = require('./CoreProduct/CoreProductRoutes');


// Mount routes
	//* User - Services
router.use('/user', CoreUserRoutes);


	//* Coutry - Services
router.use('/country', CoreCoutryRoutes);


	//* Business - Services
router.use('/business', CoreBusinessRoutes);


	//* Product Type - Services
router.use('product_type', CoreProductTypeRoutes);


	//* Business Location - Services
router.use('business_location', CoreBusinessLocationRoutes);


	//* Product - Services
router.use('product', CoreProductRoutes);


module.exports = router;
