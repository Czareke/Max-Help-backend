const express = require('express');
const imageUploadController = require('../controllers/imageUploadController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, imageUploadController.getAllImages)
  .post(authController.protect, imageUploadController.uploadImage);

router
  .route('/:id')
  .get(authController.protect, imageUploadController.getImageById)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    imageUploadController.deleteImage
  );

module.exports = router;
