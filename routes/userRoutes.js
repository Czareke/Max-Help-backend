    const userController = require('../controllers/userControllers');
    const authController = require('../controllers/authController');
    const express = require('express');
    const router = express.Router();

    router
    .route('/')
    .get(userController.getAllUsers)
    // .post(
    //     authController.protect,
    //     authController.restrictTo('admin'),
    //     userController.createCatalog
    // );

    router
    .route('/:id')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        userController.getUserById
    )
    .patch(
        authController.protect,
        authController.restrictTo('admin'),
        userController.updateUser
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        userController.deleteUser
    );

    router.patch('/profile', userController.updateProfile);
    router.post('/shop', userController.linkShop);
    router.patch('/preferences', userController.updatePreferences);


    module.exports = router;
