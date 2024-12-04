const catchAsync = require('../utils/catchAsync');

exports.calculatePdpPrice = catchAsync(async (req, res, next) => {
    const { pdpViews } = req.body;

    let costPer50k;
    if (pdpViews <= 50000) costPer50k = 125;
    else if (pdpViews <= 100000) costPer50k = 115;
    else if (pdpViews <= 150000) costPer50k = 105;
    else if (pdpViews <= 200000) costPer50k = 102;
    else return next(new AppError('Contact support for views over 200,000.', 400));

    const monthlyCost = Math.ceil(pdpViews / 50000) * costPer50k;

    res.status(200).json({
        status: 'success',
        data: { pdpViews, monthlyCost },
    });
});
