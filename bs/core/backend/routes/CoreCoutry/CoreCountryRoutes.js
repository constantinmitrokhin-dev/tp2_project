
const { Router } = require('express');
const router = Router();


//* Coutry
	// Get All Countries
router.get('/all', (req, res) => {
	res.json({ message: 'Se obtienen todos los paises' });
});


	// Get Country and all states by country´s {id}
router.get('/:id', (req, res) => {
	const countryId = req.params.id;

	res.json({ message: `Se recibió el Country ID: ${countryId}` });
});


	// Get Country´s and all States by country´s {name}
router.get('/byName', (req, res) => {
	const { name } = req.body;
	res.json({ message: `Se recibió el Country name: ${name}` });
});


module.exports = router;
