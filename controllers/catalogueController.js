// controllers/catalogueController.js
const multer = require('multer'); // File upload middleware
const Catalog = require('../Model/catalogueModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Multer setup for image uploads
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/catalogues'); // Save files in this directory
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `catalogue-${Date.now()}.${ext}`); // Example: catalogue-163223449.jpg
    },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

// Middleware for handling single file uploads
exports.uploadCatalogueImage = upload.single('image');

// Get all catalogues (with search)
exports.getAllCatalogs = catchAsync(async (req, res, next) => {
    console.log('GET /api/v1/catalogues called'); // Debug log
    const { search } = req.query;

    let query = {};
    if (search) {
        query = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ],
        };
    }

    const catalogs = await Catalog.find(query);
    res.status(200).json({ status: 'success', data: { catalogs } });
});

// Create a new catalogue
exports.createCatalog = catchAsync(async (req, res, next) => {
    console.log('File:', req.file); // Logs the uploaded file
    console.log('Body:', req.body); // Logs form fields

    if (req.file) {
        req.body.image = `/images/catalogues/${req.file.filename}`;
    }

    const newCatalog = await Catalog.create(req.body);

    res.status(201).json({
        status: 'success',
        data: { catalog: newCatalog },
    });
});

// Update a catalogue
exports.updateCatalog = catchAsync(async (req, res, next) => {
    if (req.file) {
        req.body.image = `/images/catalogues/${req.file.filename}`;
    }

    const catalog = await Catalog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!catalog) {
        return next(new AppError('No catalog found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { catalog },
    });
});

// Delete a catalogue
    exports.deleteCatalog = catchAsync(async (req, res, next) => {
        console.log('Attempting to delete catalog with ID:', req.params.id); // Debug log
        const catalog = await Catalog.findByIdAndDelete(req.params.id);
    
        if (!catalog) {
        console.error('Catalog not found with ID:', req.params.id);
        return next(new AppError('No catalog found with that ID', 404));
        }
    
        console.log('Catalog deleted successfully:', catalog); // Debug log
        res.status(204).json({ status: 'success', data: null });
    });
    