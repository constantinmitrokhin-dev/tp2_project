
const { Router } = require('express');
const router = Router();


//* Product Type
	// Get All Product Types
router.get('/all', (req, res) => {
	res.json({ message: 'Se obtienen todos los paises' });
});


	// Get Product Type by {id}
router.get('/:id', (req, res) => {
	const productTypeId = req.params.id;

	res.json({ message: `Se recibió el Product Type ID: ${productTypeId}` });
});


	// Get Product Type by {name}
router.get('/byName', (req, res) => {
	const { name } = req.body;
	res.json({ message: `Se recibió el Product Type name: ${name}` });
});


	// Create new Product Type
router.post('/create',(req, res) => {
	res.json({ message: `Creó nuevo Product Type` });
});


	// Update Product Type
router.patch('/update', (req, res) => {
	res.json({ message: `Se modificó el Product Type Existente` });
});


	// Delete Product Type
router.delete('/delete', (req, res) => {
	res.json({ message: `Se eleminó el Product Type Existente` });
});


module.exports = router;
