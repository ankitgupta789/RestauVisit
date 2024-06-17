const Feedback = require("../models/Feedback2");
const mailSender2 =require("../utils/mailSender2");
const User = require("../models/User");
// Controller to handle creating new feedback
exports.createFeedback = async (req, res) => {
    const { email, content } = req.body;
    console.log(email, content);

    try {
        
        const user = await User.findOne({ email: email });
		if (!user) {
			return res.json({
				success: false,
				message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
			});
		}
        // Create a new feedback with the given details
        const newFeedback = await Feedback.create({
            email,
            content,
        });
        
        await mailSender2(
        
			email2="ankitguptamanheru1@gmail.com",
            email,
			title="userFeedback",
			content
		);
        console.log(newFeedback);
        // Return the new feedback and a success message
        return res.status(200).json({
            success: true,
            data: newFeedback,
            message: "Feedback Created Successfully",
        });
    } catch (error) {
        // Handle any errors that occur during the creation of the feedback
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create Feedback",
            error: error.message,
        });
    }
};


// Controller to handle getting all feedback
exports.getAllFeedback = async (req, res) => {
    try {
        // Fetch all feedback from the database
        const allFeedback = await feedback.find();

        res.status(200).json({ feedback: allFeedback });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Controller to handle getting a specific feedback by ID
exports.getFeedbackById = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch feedback by ID from the database
        const feedback = await Feedback.findById(id);

        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.status(200).json({ feedback });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Controller to handle updating a specific feedback by ID
exports.updateFeedbackById = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, content } = req.body;

        // Find the feedback by ID and update its fields
        const updatedFeedback = await Feedback.findByIdAndUpdate(id, { email, content }, { new: true });

        if (!updatedFeedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.status(200).json({ message: "Feedback updated successfully", feedback: updatedFeedback });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Controller to handle deleting a specific feedback by ID
exports.deleteFeedbackById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the feedback by ID and delete it
        const deletedFeedback = await Feedback.findByIdAndDelete(id);

        if (!deletedFeedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.status(200).json({ message: "Feedback deleted successfully", feedback: deletedFeedback });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
