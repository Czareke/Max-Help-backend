    const Feed = require('../Model/feedModel');
    const catchAsync = require('../utils/catchAsync');
    const AppError = require('../utils/appError');

    // Calculate pricing for additional feeds
    exports.calculateFeedPrice = catchAsync(async (req, res, next) => {
    const { skuCount } = req.body;

    let pricePerSku;
    if (skuCount <= 99) pricePerSku = 0.25;
    else if (skuCount <= 499) pricePerSku = 0.20;
    else if (skuCount <= 999) pricePerSku = 0.15;
    else if (skuCount <= 9999) pricePerSku = 0.10;
    else if (skuCount <= 99999) pricePerSku = 0.05;
    else return next(new AppError('For SKUs over 100,000, contact support.', 400));

    const totalPrice = skuCount * pricePerSku;

    res.status(200).json({
        status: 'success',
        data: { skuCount, pricePerSku, totalPrice },
    });
    });

    // Purchase additional feeds
    exports.purchaseFeeds = catchAsync(async (req, res, next) => {
    const { userId, additionalFeeds, price } = req.body;

    const feed = await Feed.create({
        user: userId,
        additionalFeeds,
        price,
    });

    res.status(201).json({
        status: 'success',
        data: { feed },
    });
    });

    // Get all feed purchases for a user
    exports.getUserFeeds = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    const feeds = await Feed.find({ user: userId });

    res.status(200).json({
        status: 'success',
        data: { feeds },
    });
    });
