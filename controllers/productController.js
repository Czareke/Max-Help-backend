const Product = require('../Model/productModel');
const catchAsync = require('../utils/catchAsync');

// Fetch all products
exports.getAllProducts = catchAsync(async (req, res) => {
    const products = await Product.find();
    res.status(200).json({
        status: 'success',
        data: products,
    });
});

// Add a new product
exports.addProduct = catchAsync(async (req, res) => {
    const newProduct = await Product.create(req.body);
    res.status(201).json({
        status: 'success',
        data: newProduct,
    });
});

// Update a product by ID
exports.updateProduct = catchAsync(async (req, res) => {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: 'success',
        data: updatedProduct,
    });
});
