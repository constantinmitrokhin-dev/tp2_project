
const { Router } = require('express');
const router = Router();
const {
	core_mdlw_validate_product_id,
	core_mdlw_get_products_by_business,
	core_mdlw_get_products_by_text,
	core_mdlw_get_product_by_name,
	core_mdlw_create_product,
	core_mdlw_update_product,
	core_mdlw_delete_product
} = require('../../middlewares/mdlw_product');
const { core_mdlw_validate_id_format } = require('../../middlewares/mdlw_validate_format');
const {
	core_ctrl_get_product,
	core_ctrl_get_products,
	core_ctrl_create_product,
	core_ctrl_update_product,
	core_ctrl_delete_product
} = require('../../controllers/ctrl_product');


//* Get All Products by business_id
router.get('/all', core_mdlw_get_products_by_business, core_ctrl_get_products);

//* Get Products by text search (name, code, or description)
router.get('/byText', core_mdlw_get_products_by_text, core_ctrl_get_products);

//* Get Product by exact name
router.get('/byName', core_mdlw_get_product_by_name, core_ctrl_get_product);

//* Get Product by ID
router.get('/:id', core_mdlw_validate_id_format, core_mdlw_validate_product_id, core_ctrl_get_product);

//* Create new Product
router.post('/create', core_mdlw_create_product, core_ctrl_create_product);

//* Update Product by ID
router.patch('/update/:id', core_mdlw_validate_id_format, core_mdlw_validate_product_id, core_mdlw_update_product, core_ctrl_update_product);

//* Delete Product by ID (soft delete)
router.delete('/delete/:id', core_mdlw_validate_id_format, core_mdlw_validate_product_id, core_mdlw_delete_product, core_ctrl_delete_product);


module.exports = router;
