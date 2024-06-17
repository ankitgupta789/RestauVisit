import {toast} from "react-hot-toast"
import axios from "axios"

export const addDocument = async ({documentName,

whatWeWillLearn,
category,
instructions,
email,
 }) => {
    let result = null
    const toastId = toast.loading("Loading...");
    // console.log("Data :",data);
    // console.log("Token :",token);
    try {
        const response= await axios.post("http://localhost:4000/api/v1/course/createCourse",
        {documentName,
        whatWeWillLearn,
        category,
        instructions,
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