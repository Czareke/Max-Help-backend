// models/billingModel.js

const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    billingDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Paid', 'Unpaid', 'Pending'],
        default: 'Pending',
    },
    invoiceNumber: {
        type: String,
        unique: true,
        required: true,
    },
});

const Billing = mongoose.model('Billing', billingSchema);

module.exports = Billing;
