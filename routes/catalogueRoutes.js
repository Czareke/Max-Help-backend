// routes/catalogueRoutes.js
const express = require('express');
const catalogueController = require('../controllers/catalogueController');

const router = express.Router();

router
    .route('/')
    .get(catalogueController.getAllCatalogs)
    .post(
        catalogueController.uploadCatalogueImage, // Middleware for handling image uploads
        catalogueController.createCatalog
    );

router
    .route('/:id')
    .patch(
        catalogueController.uploadCatalogueImage, // Middleware for handling image uploads
        catalogueController.updateCatalog
    )
    .delete(catalogueController.deleteCatalog);

module.exports = router;
