
const fs = require('fs');
const path = require('path');


const basename = path.basename(__filename);
const modelsDir = __dirname;
const modelDefiners = [];


// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(modelsDir)
	.filter(
		(file) =>
			file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
	)
	.forEach((file) => {
		modelDefiners.push(require(path.join(modelsDir, file)));
	});


module.exports = {
	modelDefiners
};