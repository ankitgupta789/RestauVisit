const mongoose = require("mongoose");

// Define the Courses schema
const coursesSchema = new mongoose.Schema({
	documentName: { type: String },
	
	
	whatWeWillLearn: {
		type: String,
	},
	category: {
		type: String,
	},
	instructions: {
		type: String,
	},
	email:{
		type:String,
	}
});

// Export the Courses model
module.exports = mongoose.model("Course", coursesSchema);