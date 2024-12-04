    const User = require('../Model/userModel');
    const catchAsync = require('../utils/catchAsync');
    const AppError = require('../utils/appError');
    const jwt = require('jsonwebtoken');
    const { promisify } = require('util');
    const crypto = require('crypto');
    const sendEmail = require('../utils/email'); // Ensure email utility is implemented

    // Helper function to sign JWT
    const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    };

    // Handle duplicate field errors
    const handleDuplicateFieldsDB = (err) => {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Duplicate field value: '${value}'. Please use a different value for '${field}'.`;
    return new AppError(message, 400);
    };

    // @desc User Registration (Signup)
    exports.signup = catchAsync(async (req, res, next) => {
    const { username, email, password } = req.body;

    // Validate input fields
    if (!username || !email || !password) {
        return next(new AppError('Username, email, and password are required.', 400));
    }

    // Check for duplicate username or email
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        const duplicateField = existingUser.username === username ? 'username' : 'email';
        return next(new AppError(`Duplicate field value: '${req.body[duplicateField]}'. Please use a different ${duplicateField}.`, 400));
    }

    // Create a new user
    const user = await User.create({ username, email, password });

    // Generate a JWT token
    const token = signToken(user._id);

    // Send response with token
    res.status(201).json({
        status: 'success',
        token,
        data: {
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
        },
    });
    });

    // @desc User Login
    exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    // Check for missing fields
    if (!email || !password) {
        return next(new AppError('Please provide email and password.', 400));
    }
    // Find the user and explicitly select the password field
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password, user.password))) {
        return next(new AppError('Incorrect email or password.', 401));
    }
    // Generate JWT token
    const token = signToken(user._id);
    // Send response with token
    res.json({
        status: 'success',
        token,
        data: {
        username: user.username,
        email: user.email,
        },
    });
    });
    // @desc Forgot Password
    exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('No user found with that email.', 404));
    }
    // Generate OTP
    const otp = crypto.randomBytes(3).toString('hex'); // Generates a 6-digit hex string
    user.passwordResetOTP = otp;
    user.passwordResetOTPExpires = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes
    await user.save({ validateBeforeSave: false });
    // Send OTP via email
    const message = `Your OTP for password reset is: ${otp}. It is valid for 15 minutes.`;
    try {
        await sendEmail({
        email: user.email,
        subject: 'Password Reset OTP',
        message,
        });
        res.status(200).json({
        status: 'success',
        message: 'OTP sent to email.',
        });
    } catch (err) {
        user.passwordResetOTP = undefined;
        user.passwordResetOTPExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('There was an error sending the email. Try again later.', 500));
    }
    });
    // @desc Reset Password
    exports.resetPassword = catchAsync(async (req, res, next) => {
    const { otp, newPassword } = req.body;
    const user = await User.findOne({
        passwordResetOTP: otp,
        passwordResetOTPExpires: { $gt: Date.now() },
    });
    if (!user) {
        return next(new AppError('Invalid or expired OTP.', 400));
    }
    user.password = newPassword;
    user.passwordResetOTP = undefined;
    user.passwordResetOTPExpires = undefined;
    await user.save();
    res.status(200).json({
        status: 'success',
        message: 'Password updated successfully.',
    });
    });
    // @desc Protect Middleware (Auth Guard)
    exports.protect = catchAsync(async (req, res, next) => {
    // Check for token in headers
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }
    // Verify the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // Check if user exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
        return next(new AppError('The user belonging to this token no longer exists.', 401));
    }
    // Check if user changed password after the token was issued
    if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }
    // Grant access to protected route
    req.user = freshUser;
    next();
    });
    // @desc Restrict to Roles Middleware
    exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
        return next(new AppError('Unauthorized to access this route.', 403));
        }
        next();
    };
    };
    // @desc Get Current User Profile
    exports.getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.json({
        status: 'success',
        data: user,
    });
    });
    // @desc Update Current User Profile
    exports.updateMe = catchAsync(async (req, res, next) => {
    const { username, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { username, email },
        { new: true, runValidators: true }
    );
    if (!updatedUser) {
        return next(new AppError('User not found.', 404));
    }
    res.json({
        status: 'success',
        data: updatedUser,
    });
    });