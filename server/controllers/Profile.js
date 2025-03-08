const Profile = require("../models/Profile2");



exports.createProfile = async (req, res) => {
    const { gender, dateOfBirth, about, contactNumber, email, address } = req.body;
    

    try {
        
        // Create a new feedback with the given details
		console.log("email is,",email);
		console.log("am i called or not");
        const newProfile = await Profile.create({
			gender, dateOfBirth, about, contactNumber, email, address
        });
        
        
        console.log(newProfile);
        // Return the new feedback and a success message
        return res.status(200).json({
            success: true,
            data: newProfile,
            message: "profile Created Successfully",
        });
    } catch (error) {
        
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create Profile",
            error: error.message,
        });
    }
};
exports.getProfileByEmail = async (req, res) => {
    const { email } = req.params;
    
    try {
		//console.log("check");
		console.log("email is",email);
        const profile = await Profile.findOne({ email:email });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }
		console.log("fetched profile is",profile)
        return res.status(200).json({
            success: true,
            data: profile,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get Profile",
            error: error.message,
        });
    }
};
