
const { Router } = require('express');
const router = Router();


//* Business Location
	// Get All Business Locations
router.get('/all', (req, res) => {
	res.json({ message: 'Se obtienen todos los paises' });
});


	// Get Business Location by {id}
router.get('/:id', (req, res) => {
	const productTypeId = req.params.id;
	res.json({ message: `Se recibió el Business Location ID: ${productTypeId}` });
});


	// Get Business Location by {name}
router.get('/byName', (req, res) => {
	const { name } = req.body;
	res.json({ message: `Se recibió el Business Location name: ${name}` });
});


	// Create new Business Location
router.post('/create',(req, res) => {
	res.json({ message: `Creó nuevo Business Location` });
});


	// Update Business Location
router.patch('/update', (req, res) => {
	res.json({ message: `Se modificó el Business Location Existente` });
});


	// Delete Business Location
router.delete('/delete', (req, res) => {
	res.json({ message: `Se eleminó el Business Location Existente` });
});


module.exports = router;
