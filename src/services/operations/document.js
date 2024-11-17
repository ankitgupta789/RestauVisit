import {toast} from "react-hot-toast"
import axios from "axios"

export const addDocument = async ({title,
  category,
  authorName, 
  content,
  articleSummary,
  difficultyLevel,
  enableComments,
  email,
 }) => {
    let result = null
    const toastId = toast.loading("Loading...");
    // console.log("Data :",data);
    // console.log("Token :",token);
    try {
      console.log("kuch hai??",title,category,authorName,content,articleSummary,difficultyLevel,enableComments,email);
        const response= await axios.post("http://localhost:4000/api/v1/course/createCourse",
        {title,
          category,
          authorName, 
          content,
          articleSummary,
          difficultyLevel,
          enableComments,
          email
      })
      console.log("CREATE DOCUMENT API RESPONSE............", response)
  
      // if (!response?.data?.success) {
      //   throw new Error("Could Not Add Document Details")
      // }
      toast.success("Document Details Added Successfully")
      result="Done"
      // result = response?.data?.data
    }
     catch (error) {
      console.log("CREATE DOCUMENT API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
  };
  export const getAllDocuments = async () => {
    let result = null;
    const toastId = toast.loading("Loading...");
    try {
      const response = await axios.get("http://localhost:4000/api/v1/course/getAllCourses");
      console.log("GET ALL DOCUMENTS API RESPONSE............", response);
  
      toast.success("Documents Fetched Successfully");
      result = response.data.data; // Adjust according to your API response structure
    } catch (error) {
      console.log("GET ALL DOCUMENTS API ERROR............", error);
      toast.error(error.message);
    }
    toast.dismiss(toastId);
    return result;
  };
  // Function to check if a document exists by documentName
export const checkDocumentExistence = async (documentName) => {
  try {
    
    const response = await axios.get(
      `http://localhost:4000/api/v1/course/checkCourseExistence/${documentName}`
    );
    console.log("CHECK DOCUMENT EXISTENCE API RESPONSE............", response);
    
    if (!response.data.success) {
      toast.error(`document name ${documentName}doesn't exist`);
      return false;
    }

    return true;
  } catch (error) {
    console.log("CHECK DOCUMENT EXISTENCE API ERROR............", error);
    toast.error(error.message);
    return false;
  }
};
// Function to get all unpublished courses
export const getUnpublishedCourses = async () => {
  let result = null;
  const toastId = toast.loading("Loading...");

  try {
    // Make a GET request to fetch unpublished courses
    const response = await axios.get("http://localhost:4000/api/v1/course/getUnpublishedCourses");
    
    // Log the response for debugging
    console.log("GET UNPUBLISHED COURSES API RESPONSE............", response);
    
    // Check if the response is successful
    if (response.data.success) {
      toast.success("Unpublished Courses Fetched Successfully");
      result = response.data.data; // Assuming that the courses are stored in response.data.data
    } else {
      toast.error("No unpublished courses found.");
    }
  } catch (error) {
    // Handle errors and show a toast notification
    console.log("GET UNPUBLISHED COURSES API ERROR............", error);
    toast.error(error.message);
  }

  // Dismiss the loading toast
  toast.dismiss(toastId);

  // Return the result
  return result;
};
