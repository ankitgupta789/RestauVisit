const Query = require("../models/Query");
//const mailSender2 =require("../utils/mailSender2");
//const User = require("../models/User");
// Controller to handle creating new feedback
const mailSender = require("../utils/mailSender");
exports.createQuery = async (req, res) => {
    const { query,email,documentName,userEmail } = req.body;
    

    try {
        
        // Create a new feedback with the given details
        const newQuery = await Query.create({
            query,email,documentName,userEmail
        });
        
        
        console.log(newQuery);
        // Return the new feedback and a success message
        return res.status(200).json({
            success: true,
            data: newQuery,
            message: "newQuery Created Successfully",
        });
    } catch (error) {
        // Handle any errors that occur during the creation of the newQuery
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create newQuery",
            error: error.message,
        });
    }
};


// Controller to handle getting all feedback
exports.getAllQuery = async (req, res) => {
    try {
        // Fetch all feedback from the database
        const allQuery = await Query.find();

        res.status(200).json({ Query: allQuery });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
exports.deleteQuery = async (req, res) => {
    const { queryId } = req.params;
    const { Email } = req.body; 
    console.log("query id is: ",queryId);
    console.log("email of user is",Email);
    try {
        // Find the query by ID and delete it
        const deletedQuery = await Query.findByIdAndDelete(queryId);
        

        if (!deletedQuery) {
            return res.status(404).json({
                success: false,
                message: "Query not found",
            });
        }
       if(deletedQuery){
        console.log("i have sent the mail okkk!!!")
        await mailSender(Email, "Query Resolved", "Hii student this email is in regard to your query that you raise on Space Exploration ,               Your query has been resolved and deleted from the datase if you have not interacted with the instructor then reply on this email.");
       }
        // Return a success message
        return res.status(200).json({
            success: true,
            message: "Query deleted successfully",
        });
    } catch (error) {
        // Handle any errors that occur during the deletion of the query
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete query",
            error: error.message,
        });
    }
};

