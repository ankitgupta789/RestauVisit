import {toast} from "react-hot-toast"
import axios from "axios"

export const addDocument = async ({documentName,
description,
whatWeWillLearn,
category,
instructions,
 }) => {
    let result = null
    const toastId = toast.loading("Loading...");
    // console.log("Data :",data);
    // console.log("Token :",token);
    try {
        const response= await axios.post("http://localhost:4000/api/v1/course/createCourse",
        {documentName,
        description,
        whatWeWillLearn,
        category,
        instructions
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
  }