const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    reviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    username: {
         type: String,
         required: true,
    },
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Reply = mongoose.model('Reply', replySchema);
module.exports = Reply;