

const FileFactory = require('./src/classes/FileFactory');
const Product = require('./src/classes/Product');
const Country = require('./src/classes/Country');
const State = require('./src/classes/State');
const fs = require('fs');
const path = require('path');


// Establece el PATH de la carpeta de carga
const DIRECTORY_NAME = 'data';
const DATA_FOLDER_PATH = path.join(__dirname, DIRECTORY_NAME);


// Buscar todos los archivos Excel / PDF / CSV en la carpeta
function loader_find_relevant_files(beginsWith) {
	return fs.readdirSync(DATA_FOLDER_PATH).filter((file) =>
		(file.endsWith('.xlsx') || file.endsWith('.xls') || file.endsWith('.pdf') || file.endsWith('.csv')) && file.startsWith(beginsWith)
	);
}


// Sanitiza las líneas procesadas
function loader_sanitize_product_data(productList) {
	const sanitizedList = productList
	.map(e => {
		// Si existe la clave 'Precio'
			if ('Precio' in e && 'Código' in e && Object.keys(e).length === 2 && typeof e['Precio'] === 'string') {
				delete e['Precio'];
			}
		// Sanitiza el 'Código'
			if ('Código' in e) {
				e['Código'] = e['Código'].toString().trim()
			}
		// Sanitiza la 'Descripción'
			if ('Descripción' in e) {
				e['Descripción'] = e['Descripción'].toString().trim()
			}
		return e;
	})
	// Elimina las líneas vacias
	.filter(e => !(Object.keys(e).length === 1 && 'Precio' in e))
	// Elimina las descripciones sin 'Código'
	.filter(e => !('Descripción' in e && !('Código' in e)))
	// Elimina los contenidos de los Kits
	.filter(e => !('Varios' in e))
	return sanitizedList;
}


function loader_build_products(productList){
	const sanitizedList = loader_sanitize_product_data(productList);
	let category = '';
	const products = [];
	for (let i = 0; i < sanitizedList.length; i++) {
		const e = sanitizedList[i];
		if( Object.keys(e).length === 1 && 'Código' in e) {
			if (e['Código'] !== e['Código'].toUpperCase()) continue;
			category = e['Código'];
			continue;
		}

		let details = 'Detalle' in e ? e['Detalle'].trim() : null;
		let product = new Product(category, e['Código'], e['Descripción'], e['Precio'], details);
		products.push(product);
	}

	return products;
}


async function loader_build_products_from_files() {
	let processedProductList = [];
	let initialProductList;
	const files = loader_find_relevant_files('products');
	if (files.length === 0) {
		console.log('⚠️ No se encontraron archivos válidos para procesar en /list');
		process.exit(0);
	}
	try {
		for (let i = 0; i < files.length; i++) {
			const element = files[i];
			const e = FileFactory.create(`${DATA_FOLDER_PATH}\\${element}`)
			initialProductList = await e.sheetToJSON();
			processedProductList = [...processedProductList, ...loader_build_products(initialProductList)];
		}
	} catch (e) {
		console.error(e.message);
	}
	//* Agregar múltiples descripciones al producto
	for (let i = 0; i < initialProductList.length; i++) {
		const rawProduct = initialProductList[i];
		if ('Código' in rawProduct && 'Descripción' in rawProduct) {
			let j = i + 1;
			while (j < initialProductList.length && !('Código' in initialProductList[j]) && 'Descripción' in initialProductList[j]){
				const product = processedProductList.find(e => e.code == rawProduct['Código']);
				if(product) product.addDescription(initialProductList[j]['Descripción']);
				j++;
			}
		}
	}

	return processedProductList;
}


function loader_build_countries(countryList){
	const countries = [];
	for (let i = 0; i < countryList.length; i++) {
		const e = countryList[i];
		let country = new Country(e.name, e.iso3, e.iso2, e.currency, e.currency_name, e.currency_symbol, e.tld, e.phonecode);
		countries.push(country);
	}

	return countries;
}


async function loader_build_countries_from_files() {
	let processedCountryList = [];
	let initialCountryList;
	const files = loader_find_relevant_files('countries');
	if (files.length === 0) {
		console.log('⚠️ No se encontraron archivos válidos para procesar en /list');
		process.exit(0);
	}
	try {
		for (let i = 0; i < files.length; i++) {
			const element = files[i];
			const e = FileFactory.create(`${DATA_FOLDER_PATH}\\${element}`)
			initialCountryList = await e.sheetToJSON();
			processedCountryList = [...processedCountryList, ...loader_build_countries(initialCountryList)];
		}
	} catch (e) {
		console.error(e.message);
	}

	return processedCountryList;
}

function loader_build_states(stateList){
	const states = [];
	for (let i = 0; i < stateList.length; i++) {
		const e = stateList[i];
		let state = new State(e.name, e.iso3166_2, e.iso2, e.country_code, e.country_name, e.type);
		states.push(state);
	}

	return states;
}


async function loader_build_states_from_files() {
	let processedStateList = [];
	let initialStateList;
	const files = loader_find_relevant_files('states');
	if (files.length === 0) {
		console.log('⚠️ No se encontraron archivos válidos para procesar en /list');
		process.exit(0);
	}
	try {
		for (let i = 0; i < files.length; i++) {
			const element = files[i];
			const e = FileFactory.create(`${DATA_FOLDER_PATH}\\${element}`)
			initialStateList = await e.sheetToJSON();
			processedStateList = [...processedStateList, ...loader_build_states(initialStateList)];
		}
	} catch (e) {
		console.error(e.message);
	}

	return processedStateList;
}


module.exports = {
	loader_build_products_from_files,
	loader_build_countries_from_files,
	loader_build_states_from_files
};
