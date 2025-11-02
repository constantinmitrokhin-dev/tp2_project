
const fs = require('fs');
const path = require('path');
const { defineModels } = require('../models/models.js');


async function initializeDatabase(sequelize) {
	try {
		const queriesPath = path.join(__dirname, '..', 'models', 'queries', 'queries.sql');
		if (fs.existsSync(queriesPath)) {
			const sql = fs.readFileSync(queriesPath, 'utf8');
			try {
				await sequelize.query(sql);
				console.log('queries.sql executed');
			} catch (err) {
				// Ignorar tipo ya existe (42710) u otros errores idempotentes
				const code = err && err.parent && err.parent.code;
				if (code === '42710') {
					console.warn('Warning: los Custom DataTYPEs ya han sido creados - continuando');
				} else {
					throw err;
				}
			}
		}

		// ahora inicializar modelos
		await defineModels(sequelize, require('sequelize').DataTypes);

		// sincronizar modelos con la base de datos
		await sequelize.sync({ force: true/*, alter: true*/ });

		return true;
	} catch (error) {
		console.error('Error initializing database:', error);
		throw error;
	}
}


module.exports = {
	initializeDatabase
};
