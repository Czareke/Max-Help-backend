    const mongoose = require('mongoose');

    const skuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], required: true },
    impressionScore: { type: Number, required: true },
    priceChange: { type: Number, default: 0 },
    });

    const SKU = mongoose.model('SKU', skuSchema);

    module.exports = SKU;
