
const { Router } = require("express");
const router = Router();


//* User
	// Create new Account
router.post("/register", (req, res) => {
  res.json({ message: "Cuenta creada correctamente" });
});

	// Login
router.get("/login", (req, res) => {
  res.json({ message: "Cuenta logueada correctamente" });
});


module.exports = router;
