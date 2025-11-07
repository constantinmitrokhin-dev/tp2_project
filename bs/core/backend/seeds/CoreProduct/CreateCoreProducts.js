
const { loader_build_products_from_files } = require("../../../../../loader/index.js");
const CoreProduct  = require("../../models/core_product.js");
const CoreProductType  = require("../../models/core_product_type.js");


module.exports = async function () {
	const productsArray = await loader_build_products_from_files();
	// productsArray.forEach(e => { console.log(e); });
	const categoryName = '';
	let currentCategory = null;
	productsArray.sort((a, b) => a._category.localeCompare(b._category));
	for (let i = 0; i < productsArray.length; i++) {
		const product = productsArray[i];
		if(categoryName !== product._category && product._category !== undefined){
			currentCategory = new CoreProductType({name: `${productsArray[i]._category}`, business_id: null, kind: null});
			await currentCategory.save();
			console.log(`Creando categoría de producto: ${currentCategory.name}`);
		}
		const newProduct = new CoreProduct({
			type_id: currentCategory.id,
			business_id: null,
			name: product._name,
			code: product._code,
			descriptions: Array.isArray(product._descriptions) ? product._descriptions.join('; ') : product._descriptions,
			price: product._price,
		});
		await newProduct.save();
		console.log(`Creando producto: ${newProduct.name}`);
	}
}


// Product {
//   _category: 'ACCESORIOS EN "POLIPROPILENO"',
//   _code: '264',
//   _descriptions: [ 'NIPLE 3/4 X 8' ],
//   _price: 273.9825,
//   _details: null,
//   _images: []
// }
