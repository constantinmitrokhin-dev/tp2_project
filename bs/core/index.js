
require('dotenv').config();
const server = require("./backend/server.js");
const { conn, ensureDatabase } = require("./backend/db.js");
const PORT = process.env.PORT;

// Ensure DB Creation
ensureDatabase()
	.then(() => conn.sync({ force: true /*alter: true*/ }))
	.then(() => {
		server.listen(PORT, () => {
			console.log(`🚀 Server listening at ${PORT}`);
		});
	})
	.catch(err => {
		console.error("❌ Error starting server:", err);
	});
