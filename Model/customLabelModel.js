    const mongoose = require('mongoose');

    const customLabelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String }
    });

    module.exports = mongoose.model('CustomLabel', customLabelSchema);