
const path = require('path');
const { core_mod_define_models } = require('../models/models.js');
const { core_conn_execute_query_from_file } = require('./utiles.js');


async function core_conn_initialize_database(sequelize) {
	try {
		const typesPath = path.join(__dirname, '..', 'models', 'queries', 'types.sql');
		await core_conn_execute_query_from_file(sequelize, typesPath);

		// ahora inicializar modelos
		sequelize.models = await core_mod_define_models(sequelize, require('sequelize').DataTypes);

		// sincronizar modelos con la base de datos
		await sequelize.sync({ force: true/*, alter: true*/ });

		return true;
	} catch (error) {
		console.error('Error initializing database:', error);
		throw error;
	}
}


module.exports = {
	core_conn_initialize_database
};
