const express = require('express');
const feedController = require('../controllers/feedControllelr');
const { createFeedPurchase, getUserFeeds } = require('../controllers/feedControllelr');
const router = express.Router();


// GET - Get all feeds for a specific user
router.get('/:userId', getUserFeeds);
router.post('/calculate-price', feedController.calculateFeedPrice);
router.post('/purchase', feedController.purchaseFeeds);

module.exports = router;
