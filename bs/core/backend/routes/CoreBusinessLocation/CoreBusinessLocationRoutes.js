
const { Router } = require('express');
const router = Router();
const {
	core_mdlw_validate_id_format,
	core_mdlw_validate_text_search_format } = require('../../middlewares/mdlw_validate_format');


//* Business Location
	// Get All Business Locations
router.get(
	'/all',
	core_mdlw_validate_text_search_format,
	(req, res) => {
	res.json({ message: 'Se obtienen todos los paises' });
});


// Get Business Location by {name}
router.get('/byName',
	(req, res) => {
	const { name } = req.query;
	res.json({ message: `Se recibió el Business Location name: ${name}` });
});


	// Get Business Location by {id}
router.get(
	'/:id',
	core_mdlw_validate_id_format,
	 (req, res) => {
	const businessLocId = req.params.id;
	res.json({ message: `Se recibió el Business Location ID: ${businessLocId}` });
});


	// Create new Business Location
router.post('/create',
	(req, res) => {
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
