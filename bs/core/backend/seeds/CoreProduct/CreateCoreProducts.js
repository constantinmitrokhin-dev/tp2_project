
const { loader_build_products_from_files } = require("../../../../../loader/index.js");
const CoreProduct  = require("../../models/core_product.js");
const CoreProductType  = require("../../models/core_product_type.js");


module.exports = async function (sequelize) {
	const productsArray = await loader_build_products_from_files();
	productsArray.sort((a, b) => a._category.localeCompare(b._category));
	// productsArray.forEach(e => { console.log(e); });
	let currentCategory = null;
	for (let i = 0; i < productsArray.length; i++) {
		const product = productsArray[i];
		if((!currentCategory || currentCategory.name !== product._category) && product._category !== undefined){
			await sequelize.transaction(async (t) => {
				currentCategory = await CoreProductType.create(
					{name: `${product._category}`, business_id: null, kind: null},
					{transaction: t}
				);
			});
		}

		console.log(`type_id: ${currentCategory.id}, name: ${product._descriptions[0]}, code: ${product._code}, descriptions: ${Array.isArray(product._descriptions) ? product._descriptions.join(', ') : product._descriptions}, price: ${isNaN(product._price) ? 0 : product._price}`);

		const newProduct = CoreProduct.create({
			type_id: currentCategory.id,
			business_id: null,
			name: !product._name ? product._descriptions[0] : product._name,
			code: product._code,
			description: Array.isArray(product._descriptions) ? product._descriptions.join(', ') : product._descriptions,
			price:  product._price && !isNaN(product._price) ? parseFloat(product._price) : 0,
		});

	}
}
