
require('dotenv').config();
const server = require("./backend/server.js");
const { sequelize } = require("./backend/connection/sequelize.js");
const { initializeDatabase } = require("./backend/connection/connection.js");
const { ensureDatabase } = require("./backend/connection/utiles.js");
const seeds = require("./backend/seeds/seeds.js");

const PORT = process.env.PORT;

async function startServer() {
	try {
		// Inicializar base de datos con tipos personalizados
		await ensureDatabase();
		await initializeDatabase(sequelize);
		await seeds();

		// Iniciar servidor
		server.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});

	} catch (error) {
		console.error('Failed to start server:', error);
		process.exit(1);
	}
}

startServer();