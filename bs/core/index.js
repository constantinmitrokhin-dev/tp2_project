
require('dotenv').config();
const server = require('./backend/server.js');
const { sequelize } = require('./backend/connection/sequelize.js');
const { core_conn_initialize_database } = require('./backend/connection/connection.js');
const { core_conn_ensure_database } = require('./backend/connection/utiles.js');
const CoreObject = require('./backend/models/core_object.js');
const seeds = require('./backend/seeds/seeds.js');
const PORT = process.env.PORT;


async function core_start_server() {
	try {
		// Inicializar base de datos con tipos personalizados
		await core_conn_ensure_database();
		await core_conn_initialize_database(sequelize);

		const coreObjectCount = await CoreObject.count();
		if (process.env.SYNC_PARAMS !== '{"alter":true}' || coreObjectCount == 0) {
			console.log('Poblando la DB...');
			await seeds(sequelize);
		}

		// Iniciar servidor
		server.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});

	} catch (error) {
		console.error('Failed to start server:', error);
		process.exit(1);
	}
}


core_start_server();
