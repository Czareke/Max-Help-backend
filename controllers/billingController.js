const Billing = require('../Model/billingModels');
const catchAsync = require('../utils/catchAsync');
const { v4: uuidv4 } = require('uuid'); // Install uuid for generating unique invoice numbers
// Get billing history
exports.getBillingHistory = catchAsync(async (req, res, next) => {
    const history = await Billing.find({ user: req.user.id });
    res.status(200).json({
        status: 'success',
        data: { history },
    });
});


const createBill = async (req, res) => {
    const { userId, amount, description } = req.body;

    const bill = await Billing.create({
        user: userId,
        amount,
        description,
        invoiceNumber: uuidv4(),
    });

    res.status(201).json({
        status: 'success',
        data: { bill },
    });
};

module.exports = {
    createBill,
};