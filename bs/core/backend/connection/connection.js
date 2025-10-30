
const fs = require('fs');
const path = require('path');
const { sequelize } = require('./sequelize.js');
const { modelDefiners } = require('../models/models.js');


modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
const entries = Object.entries(sequelize.models);
const capsEntries = entries.map((entry) => [
	entry[0][0].toUpperCase() + entry[0].slice(1),
	entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);


const {
	CoreObject
} = sequelize.models;


//! Relationships
// No hay relaciones por el momento


module.exports = {
	...sequelize.models,
	conn: sequelize
};
