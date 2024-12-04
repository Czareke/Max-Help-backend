    const User = require('../Model/userModel');
    const catchAsync = require('../utils/catchAsync');
    const AppError = require('../utils/appError');
    // Get all users
    exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.json(users);
    });
    // Get a user by ID
    exports.getUserById = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.json(user);
    });
    // Update a user
    exports.updateUser = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true, // Ensures data integrity
    });
    if (!updatedUser) {
        return next(new AppError('User not found', 404));
    }
    res.json(updatedUser);
    });

    // Delete a user
    exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(204).json({ message: 'User deleted successfully' });
    });
// Update user profile
exports.updateProfile = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
    res.status(200).json({
        status: 'success',
        data: { user: updatedUser },
    });
});

// Link shop (e.g., Shopify, Magento)
exports.linkShop = catchAsync(async (req, res, next) => {
    const { shopType, shopDetails } = req.body;
    const user = await User.findById(req.user.id);

    user.linkedShops.push({ shopType, shopDetails });
    await user.save();

    res.status(200).json({
        status: 'success',
        data: { user },
    });
});
// Update user preferences
exports.updatePreferences = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, { preferences: req.body.preferences }, { new: true });
    res.status(200).json({
        status: 'success',
        data: { user: updatedUser },
    });
});
