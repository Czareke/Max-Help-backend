const express = require('express');
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');
const AppError = require('../utils/appError');
const router = express.Router();

// Validation Middleware
const validateSignup = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('A valid email is required'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
];

const validateLogin = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('A valid email is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

// Validation Error Handler
const checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError(errors.array()[0].msg, 400));
    }
    next();
};

// Routes
router.post('/signup', validateSignup, checkValidation, authController.signup);
router.post('/login', validateLogin, checkValidation, authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updateMe', authController.updateMe);

module.exports = router;
