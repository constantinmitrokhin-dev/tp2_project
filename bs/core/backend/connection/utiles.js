
require('dotenv').config();
const fs = require('fs');
const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT } = process.env;
const pgtools = require('pgtools');


async function core_conn_ensure_database() {
	try {
		await pgtools.createdb({
			user: DB_USER,
			password: DB_PASSWORD,
			port: DB_PORT,
			host: DB_HOST
		}, DB_NAME);

		console.log(`✅ Database "${DB_NAME}" created successfully`);
	} catch (err) {
		if (err.name === 'duplicate_database') {
			console.log(`ℹ️ Database "${DB_NAME}" already exists`);
		} else {
			throw err;
		}
	}
}


async function core_conn_execute_query_from_file(sequelize, filePath) {
	if (fs.existsSync(filePath)) {
		const sql = fs.readFileSync(filePath, 'utf8');
		try {
			await sequelize.query(sql);
			console.log(`${filePath} executed`);
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
}


module.exports = {
	core_conn_ensure_database,
	core_conn_execute_query_from_file
};
