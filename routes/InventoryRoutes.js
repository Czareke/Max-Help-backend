const express = require('express');
const inventoryController = require('../controllers/inventoryController');
const multer = require('multer'); // For handling image uploads

// Set up multer storage (if necessary)
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.get('/products', inventoryController.getAllProducts);
router.post('/products', upload.single('image'), inventoryController.createProduct);
router.put('/products/:id', upload.single('image'), inventoryController.updateProduct);
router.delete('/products/:id', inventoryController.deleteProduct);

module.exports = router;
