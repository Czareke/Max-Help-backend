    const DataFeed = require('../Model/dataFeedModel');
    const catchAsync = require('../utils/catchAsync');
    const AppError = require('../utils/appError');

    exports.getAllDataFeeds = catchAsync(async (req, res, next) => {
    const dataFeeds = await DataFeed.find();
    res.json(dataFeeds);
    });

    exports.getDataFeedById = catchAsync(async (req, res, next) => {
    const dataFeed = await DataFeed.findById(req.params.id);
    if (!dataFeed) {
        return next(new AppError('Data feed not found', 404));
    }
    res.json(dataFeed);
    });

    exports.createDataFeed = catchAsync(async (req, res, next) => {
    const dataFeed = await DataFeed.create(req.body);
    res.status(201).json(dataFeed);
    });

    exports.updateDataFeed = catchAsync(async (req, res, next) => {
    const dataFeed = await DataFeed.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!dataFeed) {
        return next(new AppError('Data feed not found', 404));
    }
    res.json(dataFeed);
    });

    exports.deleteDataFeed = catchAsync(async (req, res, next) => {
    const dataFeed = await DataFeed.findByIdAndDelete(req.params.id);
    if (!dataFeed) {
        return next(new AppError('Data feed not found', 404));
    }
    res.status(204).json({ message: 'Data feed deleted successfully' });
    });
