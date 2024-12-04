    const SKU = require('../Model/skuModel');
    const catchAsync = require('../utils/catchAsync');
    const AppError = require('../utils/appError');

    // Get all products
    exports.getAllProducts = catchAsync(async (req, res, next) => {
    const products = await SKU.find();
    res.status(200).json({
        status: 'success',
        data: { products },
    });
    });

    // Add a new product
    exports.createProduct = catchAsync(async (req, res, next) => {
    const productData = {
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock,
        description: req.body.description,
    };

    // Handle image upload if exists
    if (req.file) {
        productData.image = req.file.path; // Assuming you're using multer for file upload
    }

    const newProduct = await SKU.create(productData);
    res.status(201).json({
        status: 'success',
        data: { product: newProduct },
    });
    });

    // Update a product
    exports.updateProduct = catchAsync(async (req, res, next) => {
    const updatedProduct = await SKU.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!updatedProduct) return next(new AppError('No product found with that ID', 404));

    res.status(200).json({
        status: 'success',
        data: { product: updatedProduct },
    });
    });

    // Delete a product
    exports.deleteProduct = catchAsync(async (req, res, next) => {
    const deletedProduct = await SKU.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return next(new AppError('No product found with that ID', 404));

    res.status(204).json({
        status: 'success',
        data: null,
    });
    });
