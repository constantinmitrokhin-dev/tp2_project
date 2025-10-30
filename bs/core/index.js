
require('dotenv').config();
const server = require("./backend/server.js");
const { conn } = require("./backend/connection/connection.js");
const { ensureDatabase } = require("./backend/connection/utiles.js");
const PORT = process.env.PORT;
const { loader_build_products_from_files, loader_build_countries_from_files } = require("../../loader/index.js");


async function startServer() {
	try {
		// Ensure DB Creation
		await ensureDatabase();
		await conn.sync({ force: true /* alter: true */ });

		server.listen(PORT, () => {
			console.log(`🚀 Server listening at ${PORT}`);
		});

		const products = await loader_build_products_from_files();
		// TODO: Queda pendiente procesar los productos y agregarlos a la DB.
		// FIXME: Procesarlo en seeds
		console.log(products)

		const countries = await loader_build_countries_from_files();
		// TODO: Queda pendiente procesar los países y agregarlos a la DB.
		// FIXME: Procesarlo en seeds
		console.log(countries)
	} catch (err) {
		console.error("❌ Error starting server:", err);
	}
}

startServer();