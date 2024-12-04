// models/feedModel.js

const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    additionalFeeds: {
        type: Number,
        required: true,
    },
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
    price: {
        type: Number,
        required: true,
    },
});

const Feed = mongoose.model('Feed', feedSchema);

module.exports = Feed;
