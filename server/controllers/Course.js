const Course = require("../models/Course");

const User = require("../models/User");
// const { toast } = require('react-hot-toast');
const mailSender = require("../utils/mailSender");
// Function to create a new course
exports.createCourse = async (req, res) => {
	try {
		// Get user ID from request object
		

		// Get all required fields from request body
		let {
			title,
      category,
      authorName, 
      content,
      articleSummary,
      difficultyLevel,
      enableComments,
      email,
		} = req.body;
      console.log("request ki body me kuch pada abhi hai",
		title,
		category,
		authorName, 
		content,
		articleSummary,
		difficultyLevel,
		enableComments,
		email,)
		// Check if any of the required fields are missing
		if (
			!title||
			!category ||
			!authorName ||
			!content||
			
			
			!articleSummary||
			!difficultyLevel||
			!enableComments||
			!email
		) {
			return res.status(400).json({
				success: false,
				message: "All Fields are Mandatory",
			});
		}

	
		// Create a new course with the given details
		const newCourse = await Course.create({
			title,
			category,
			authorName, 
			content,
			articleSummary,
			difficultyLevel,
			enableComments,
			email
		});
		console.log("mai yahan aachuka hun guys");
		//send the email to the publisher that he/she have submitted the article for review
		if(newCourse){
			console.log("i have sent the mail okkk!!!")
			await mailSender(email, "Article Submitted", "Hii Publisher, this email is in regard to your recent article that you  have sumitted on cosmolearn ,      We have recieved your article and your article is under process, we will let you know once admin approves it.");
		   }

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
  exports.getUnpublishedCourses = async (req, res) => {
	try {
	  // Find all courses where published is false
	  const unpublishedCourses = await Course.find({ published:false});
  
	  // Check if there are any unpublished courses
	  if (unpublishedCourses.length === 0) {
		return res.status(200).json({
		  success: false,
		  message: "No unpublished Articles found",
		});
	  }
  
	  // Return the list of unpublished courses
	  return res.status(200).json({
		success: true,
		data: unpublishedCourses,
		message: "Unpublished courses fetched successfully",
	  });
	} catch (error) {
	  console.error(error);
	  return res.status(500).json({
		success: false,
		message: "Failed to fetch unpublished courses",
		error: error.message,
	  });
	}
  };
  // Function to edit a published course
exports.editPublishedCourse = async (req, res) => {
	try {
	  // Get course ID from the request parameters and updated data from the request body
	  const { courseId } = req.params; // Assuming courseId is passed as a URL parameter
	  const updatedData = req.body; // Data to update the course
     console.log("data here is",updatedData);
	  // Find the course by ID and update it
	  const updatedCourse = await Course.findByIdAndUpdate(
		courseId,
		{ ...updatedData, published: true }, // Spread updated data and set published to true
		{ new: true, runValidators: true } // Return the updated document and run validators
	  );
  
	  // Check if the course was found and updated
	  if (!updatedCourse) {
		return res.status(404).json({
		  success: false,
		  message: `Course with ID '${courseId}' not found or was already published.`,
		});
	  }
  
	  // Return the updated course and a success message
	 
		console.log("i have sent the mail okkk!!!")
		await mailSender(updatedData.email, "Article Submitted", `"Hii Publisher, this email is in regard to your recent article ${updatedData.title} that you  have sumitted on cosmolearn , admin have recieved the article and marked it appropriate for publishing , Congratulations."`);
	   
	  return res.status(200).json({
		success: true,
		data: updatedCourse,
		message: "Course updated successfully and published.",
	  });
	} catch (error) {
	  console.error(error);
	  return res.status(500).json({
		success: false,
		message: "Failed to update course",
		error: error.message,
	  });
	}
  };
  exports.findbycategory = async (req, res) => {
	try {
	  // Properly destructure the category from the request body
	  const { category } = req.query; 
       console.log("hii i am here",category);
	  if (!category) {
		return res.status(400).json({
		  success: false,
		  message: "Category not provided",
		});
	  }
  
	  // Logging to verify if the category is being received
	  console.log("Category received:", category);
  
	  // Assuming your `Course` model has a `category` field
	  const allarticleswithcategory = await Course.find({ category: category });
  
	  // Check if articles with this category were found
	  if (allarticleswithcategory.length === 0) {
		return res.status(200).json({
		  success: false,
		  message: `No articles found for category: ${category}`,
		});
	  }
  
	  // Return the list of articles
	  return res.status(200).json({
		success: true,
		data: allarticleswithcategory,
		message: "Articles fetched successfully",
	  });
	} catch (error) {
	  console.error("Error fetching articles:", error.message);
	  return res.status(500).json({
		success: false,
		message: "Failed to fetch articles",
		error: error.message,
	  });
	}
  };
  