
const { Router } = require('express');
const router = Router();


//* User
	// Create new Account
router.post('/register', (req, res) => {
	res.json({ message: 'Cuenta creada correctamente' });
});


	// Login
router.get('/login', (req, res) => {
	res.json({ message: 'Cuenta logueada correctamente' });
});


	// Update User´s Data
router.patch('/update', (req, res) => {
	res.json({ message: `Se modificó el User Existente` });
});


	// Update Password
router.patch('/updatePass', (req, res) => {
	res.json({ message: `Se modificó la contraseña del User Existente` });
});


	// Delete Business Location
router.delete('/delete', (req, res) => {
	res.json({ message: `Se eleminó el User Existente` });
});


module.exports = router;
