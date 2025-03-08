import {toast} from "react-hot-toast"
import axios from "axios"

export const addfeedback = async ({email,content

 }) => {
    let result = null
    const toastId = toast.loading("Loading...");
    // console.log("Data :",data);
    // console.log("Token :",token);
     console.log(email,content);
    try {
        const response= await axios.post("http://localhost:4000/api/v1/feedback/createfeedback",
        {email,content
      })
      
      toast.success("feedback Details Added Successfully")
      result="Done"
      // result = response?.data?.data
    }
     catch (error) {
      console.log("CREATE FEEDBACK API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
  }