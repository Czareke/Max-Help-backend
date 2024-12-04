    const mongoose = require('mongoose');
    const validator = require('validator');
    const bcrypt = require('bcryptjs');

    const userSchema = new mongoose.Schema({
        username: {
            type: String,
            required: [true, 'A username is required'],
            unique: true,
            trim: true,
        },
    email: {
        type: String,
        trim: true,
        required: [true, 'Enter email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Enter a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Enter Valid Password With Uppercase and Lowercase And Must be at least 8 characters long'],
        match: [
        /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, and be at least 8 characters long.',
        ],
        select: false,
        minlength: 8,
        maxlength: 15,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    passwordChangedAt: Date,
    passwordResetOTP: String,
    passwordResetOTPExpires: Date,
    });

    userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    next();
    });

    userSchema.methods.comparePassword = async function (candidatePassword, userPassword) {
    return bcrypt.compare(candidatePassword, userPassword);
    };

    const User = mongoose.model('User', userSchema);
    module.exports = User;
