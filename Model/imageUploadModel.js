    const mongoose = require('mongoose');

    const imageUploadSchema = new mongoose.Schema({
    url: { type: String, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    catalog: { type: mongoose.Schema.Types.ObjectId, ref: 'Catalog' },
    uploadedAt: { type: Date, default: Date.now }
    });

    module.exports = mongoose.model('ImageUpload', imageUploadSchema);