
require('dotenv').config();
const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT } = process.env;
const pgtools = require('pgtools');


async function ensureDatabase() {
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


module.exports = {
	ensureDatabase
};
