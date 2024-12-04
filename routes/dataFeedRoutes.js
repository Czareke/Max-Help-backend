const express = require('express');
const dataFeedController = require('../controllers/dataFeedController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, dataFeedController.getAllDataFeeds)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    dataFeedController.createDataFeed
  );

router
  .route('/:id')
  .get(authController.protect, dataFeedController.getDataFeedById)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    dataFeedController.updateDataFeed
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    dataFeedController.deleteDataFeed
  );

module.exports = router;
