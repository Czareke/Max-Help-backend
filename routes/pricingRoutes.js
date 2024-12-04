const express = require('express');
const pricingController = require('../controllers/pricingController');

const router = express.Router();

router.post('/pdp', pricingController.calculatePdpPrice);

module.exports = router;
