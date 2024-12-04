    const mongoose = require('mongoose');

    const dataFeedSchema = new mongoose.Schema({
    name: { type: String, required: true },
    format: { type: String, enum: ['json', 'xml', 'csv'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    fileUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    generatedAt: { type: Date }
    });

    module.exports = mongoose.model('DataFeed', dataFeedSchema);