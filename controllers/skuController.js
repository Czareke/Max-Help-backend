    const SKU = require('../Model/skuModel');
    const catchAsync = require('../utils/catchAsync');
    const AppError = require('../utils/appError');

// Fetch SKU pricing tiers and structure
exports.getPricing = catchAsync(async (req, res, next) => {
    const pricing = await SKU.find({}, 'sku price tiers');
    res.status(200).json({
        status: 'success',
        data: { pricing },
    });
});

// Calculate dynamic pricing based on SKU count
exports.calculatePricing = catchAsync(async (req, res, next) => {
    const { sku, quantity } = req.body;
    const skuData = await SKU.findOne({ sku });

    if (!skuData) {
        return next(new AppError('No SKU found with that ID', 404));
    }

    const dynamicPrice = skuData.calculatePrice(quantity); // Assume method exists on SKU model
    res.status(200).json({
        status: 'success',
        data: { sku, dynamicPrice },
    });
});

// Retrieve current inventory status of all SKUs
exports.getInventory = catchAsync(async (req, res, next) => {
    const inventory = await SKU.find({}, 'sku stock status');
    res.status(200).json({
        status: 'success',
        data: { inventory },
    });
});

// Update SKU inventory details
exports.updateInventory = catchAsync(async (req, res, next) => {
    const { sku, newStock } = req.body;
    const skuData = await SKU.findOneAndUpdate({ sku }, { stock: newStock }, { new: true });

    if (!skuData) {
        return next(new AppError('No SKU found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { sku: skuData },
    });
});