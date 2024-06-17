const Course = require("../models/Course");

const User = require("../models/User");
const { toast } = require('react-hot-toast');
// Function to create a new course
exports.createCourse = async (req, res) => {
	try {
		// Get user ID from request object
		

		// Get all required fields from request body
		let {
			documentName,
			
			whatWeWillLearn,

			category,
			instructions,
			email,
		} = req.body;
      console.log("request ki body me kuch pada abhi hai",req.body,documentName,whatWeWillLearn,instructions,category,email)
		// Check if any of the required fields are missing
		if (
			!documentName ||
			!whatWeWillLearn ||
			!instructions||
			
			
			!category||
			!email
		) {
			return res.status(400).json({
				success: false,
				message: "All Fields are Mandatory",
			});
		}

	
		// Create a new course with the given details
		const newCourse = await Course.create({
			documentName,
			
			whatWeWillLearn: whatWeWillLearn,
			category,
			instructions: instructions,
			email
		});
		console.log("mai yahan aachuka hun guys");
		// Return the new course and a success message
		return res.status(200).json({
			success: true,
			data: newCourse,
			message: "Course Created Successfully",
		});
	} catch (error) {
		// Handle any errors that occur during the creation of the course
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Failed to create course",
			error: error.message,
		});
	}
};

exports.getAllCourses = async (req, res) => {
	try {
		const allCourses = await Course.find(
			{}
			
		)
			
		return res.status(200).json({
			success: true,
			data: allCourses,
		});
	} catch (error) {
		console.log(error);
		return res.status(404).json({
			success: false,
			message: `Can't Fetch Course Data`,
			error: error.message,
		});
	}
};

//getCourseDetails
exports.getCourseDetails = async (req, res) => {
    try {
            //get id
            const {courseId} = req.body;
            //find course details
            const courseDetails = await Course.find(
                                        {_id:courseId})
                                        .populate(
                                            {
                                                path:"instructor",
                                                populate:{
                                                    path:"additionalDetails",
                                                },
                                            }
                                        )
                                        .populate("category")
                                        //.populate("ratingAndreviews")
                                        .populate({
                                            path:"courseContent",
                                            populate:{
                                                path:"subSection",
                                            },
                                        })
                                        .exec();

                //validation
                if(!courseDetails) {
                    return res.status(400).json({
                        success:false,
                        message:`Could not find the course with ${courseId}`,
                    });
                }
                //return response
                return res.status(200).json({
                    success:true,
                    message:"Course Details fetched successfully",
                    data:courseDetails,
                })

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};
exports.checkCourseExistence = async (req, res) => {
	try {
	  const { documentName } = req.params;
      console.log("document name",documentName)
	  // Check if the course exists with the given document name
	  const existingCourse = await Course.findOne({ documentName:documentName });
	  
	  if (existingCourse) {
		console.log("document exists")
		return res.status(200).json({
		  success: true,
		  message: "Course exists",
		  data: existingCourse,
		});
	  } else {
		console.log("document not  exists")
		//toast.error(`Course with document name '${documentName}' does not exist`);
		return res.status(200).json({
		  success: false,
		  message: `Course with document name '${documentName}' does not exist`,
		});
	  }
	} catch (error) {
	  console.error(error);
	  return res.status(500).json({
		success: false,
		message: "Failed to check course existence",
		error: error.message,
	  });
	}
  };