const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.route('/products').get(productController.getAllProducts).post(productController.addProduct);
router.route('/:id').put(productController.updateProduct);

module.exports = router;
