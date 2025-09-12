
require('dotenv').config();
const {Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_DIALECT, DB_PORT } = process.env;
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


const sequelize = new Sequelize(
	DB_NAME, DB_USER, DB_PASSWORD,
	{
		host: DB_HOST,
		dialect: DB_DIALECT,
		port: DB_PORT,
		logging: false,
		native: false,
	},
);
// const sequelize = new Sequelize(`${DB_DIALECT}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`) // Example for postgres


module.exports = {
	conn: sequelize,
	ensureDatabase
};
