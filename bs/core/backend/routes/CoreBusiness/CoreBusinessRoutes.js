
const { Router } = require('express');
const router = Router();


//* Business
	// Register new Business and Default Employee
router.post('/register', (req, res) => {
	res.json({ message: 'Se registra un Negocio' });
});


// Get Business by {url_name}
router.get('/byUrlName', (req, res) => {
	const { url_name } = req.query;
	res.json({ message: `Se recibió el Business url_name: ${url_name}` });
});


	// Get Business by ID
router.get('/:id', (req, res) => {
	const businessId = req.params.id;
	res.json({ message: `Se recibió el Business ID: ${businessId}` });
});


module.exports = router;
