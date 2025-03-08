const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
	email:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
});

module.exports = mongoose.model("Feedback", FeedbackSchema);