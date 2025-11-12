
const { Router } = require('express');
const router = Router();


//* Core Product
	// Get All Core Products
router.get('/all', (req, res) => {
	res.json({ message: 'Se obtienen todos los paises' });
});


	// Get Core Product by {id}
router.get('/:id', (req, res) => {
	const productTypeId = req.params.id;
	res.json({ message: `Se recibió el Core Product ID: ${productTypeId}` });
});


	// Get Core Product by {name}
router.get('/byName', (req, res) => {
	const { name } = req.body;
	res.json({ message: `Se recibió el Core Product name: ${name}` });
});


	// Get Core Product by matching {name}, {code} or {description}
router.get('/byText', (req, res) => {
	const { name } = req.body;
	res.json({ message: `Se recibió el Core Product name: ${name}` });
});


	// Create new Core Product
router.post('/create',(req, res) => {
	res.json({ message: `Creó nuevo Core Product` });
});


	// Update Core Product
router.patch('/update', (req, res) => {
	res.json({ message: `Se modificó el Core Product Existente` });
});


	// Delete Core Product
router.delete('/delete', (req, res) => {
	res.json({ message: `Se eleminó el Core Product Existente` });
});


module.exports = router;
