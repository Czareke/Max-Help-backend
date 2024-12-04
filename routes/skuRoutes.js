const express = require('express');
const skuController = require('../controllers/skuController');
const authController = require('../controllers/authController');

const router = express.Router();

// Route to get pricing tiers and structure
router.get('/pricing', skuController.getPricing);

// Route to calculate dynamic pricing based on SKU count
router.post('/pricing', skuController.calculatePricing);

// Route to retrieve current inventory status of all SKUs
router.get('/inventory', skuController.getInventory);

// Route to update SKU inventory details
router.post('/inventory/update', skuController.updateInventory);

module.exports = router;
