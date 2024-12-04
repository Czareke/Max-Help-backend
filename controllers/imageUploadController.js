    const ImageUpload = require('../Model/imageUploadModel');
    const catchAsync = require('../utils/catchAsync');
    const AppError = require('../utils/appError');

    exports.getAllImages = catchAsync(async (req, res, next) => {
    const images = await ImageUpload.find();
    res.json(images);
    });

    exports.getImageById = catchAsync(async (req, res, next) => {
    const image = await ImageUpload.findById(req.params.id);
    if (!image) {
        return next(new AppError('Image not found', 404));
    }
    res.json(image);
    });

    exports.uploadImage = catchAsync(async (req, res, next) => {
    const image = await ImageUpload.create(req.body);
    res.status(201).json(image);
    });

    exports.updateImage = catchAsync(async (req, res, next) => {
    const image = await ImageUpload.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!image) {
        return next(new AppError('Image not found', 404));
    }
    res.json(image);
    });

    exports.deleteImage = catchAsync(async (req, res, next) => {
    const image = await ImageUpload.findByIdAndDelete(req.params.id);
    if (!image) {
        return next(new AppError('Image not found', 404));
    }
    res.status(204).json({ message: 'Image deleted successfully' });
    });
