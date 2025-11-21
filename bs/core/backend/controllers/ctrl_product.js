
const core_ctrl_get_product = (req, res) => {
	const { ht_data, ...rest } = req.product.get({ plain: true });
	return res.status(200).json({ 
		status: 200,
		product: rest 
	});
};


const core_ctrl_get_products = (req, res) => {
	const products = req.products.map(product => {
		const { ht_data, ...rest } = product.get({ plain: true });
		return rest;
	});
	
	return res.status(200).json({
		status: 200,
		count: products.length,
		products: products
	});
};


const core_ctrl_create_product = (req, res) => {
	const { ht_data, ...rest } = req.createdProduct.get({ plain: true });
	return res.status(201).json({
		status: 201,
		message: 'Product created successfully',
		product: rest
	});
};


const core_ctrl_update_product = (req, res) => {
	const { ht_data, ...rest } = req.updatedProduct.get({ plain: true });
	return res.status(200).json({
		status: 200,
		message: 'Product updated successfully',
		product: rest
	});
};


const core_ctrl_delete_product = (req, res) => {
	const { ht_data, ...rest } = req.deletedProduct.get({ plain: true });
	return res.status(200).json({
		status: 200,
		message: `Product ${req.deletedProduct.name} deleted successfully`,
		product: rest
	});
};


module.exports = {
	core_ctrl_get_product,
	core_ctrl_get_products,
	core_ctrl_create_product,
	core_ctrl_update_product,
	core_ctrl_delete_product
};


