
const { Router } = require('express');
const router = Router();
const { core_ctrl_register_user } = require('../../controllers/ctrl_user');


//* User
	// Create new Account
router.post('/register', core_ctrl_register_user);


	// Login
router.post('/login', (req, res) => {
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
