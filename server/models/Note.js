const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    note: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    documentName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Note', NoteSchema);