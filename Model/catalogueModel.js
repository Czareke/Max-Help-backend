
    const mongoose = require('mongoose');

    const catalogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    image:{type: String},
    createdAt: { type: Date, default: Date.now }
    });

    module.exports = mongoose.model('Catalog', catalogSchema);
