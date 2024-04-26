const feedback = require("../models/feedback");


// Controller to handle creating new feedback
exports.createFeedback = async (req, res) => {
    try {
        const { email, content } = req.body;

        // Create a new feedback instance
        const newFeedback = new Feedback({
            email,
            content
        });

        // Save the feedback to the database
        await newFeedback.save();

        res.status(201).json({ message: "Feedback created successfully", feedback: newFeedback });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
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
