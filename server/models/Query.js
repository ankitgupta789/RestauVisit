const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const querySchema = new Schema({
    documentName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
       
        required: true
    },
    query: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Query = mongoose.model('Query', querySchema);

module.exports = Query;
