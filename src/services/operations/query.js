import {toast} from "react-hot-toast"
import axios from "axios"

export const addquery = async ({query, email, documentName,userEmail

 }) => {
    let result = null
    const toastId = toast.loading("Loading...");
    // console.log("Data :",data);
    // console.log("Token :",token);
    console.log("hello ji")
    try {
        const response= await axios.post("http://localhost:4000/api/v1/query/createQuery",
        {query, email, documentName,userEmail
      })
      
      toast.success("query Details Added Successfully")
      result="Done"
      // result = response?.data?.data
    }
     catch (error) {
      console.log("CREATE QUERY API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
  };
  export const getAllQuery = async () => {
    let result = null;
    const toastId = toast.loading("Loading...");

    try {
        const response = await axios.get("http://localhost:4000/api/v1/query/getAllQuery");
        result = response.data;
        toast.success("Queries Fetched Successfully");
    } catch (error) {
        console.log("GET ALL QUERIES API ERROR............", error);
        toast.error(error.message);
    }
    toast.dismiss(toastId);
    return result;
};
export const deleteQuery = async (queryId,Email) => {
    let result = null;
    const toastId = toast.loading("Deleting...");
    try {
      const response = await axios.delete(`http://localhost:4000/api/v1/query/deleteQuery/${queryId}`, {
        data: {Email }  // Sending userEmail in the request body
      });
      toast.success("Query Deleted Successfully");
      result = response.data;
    } catch (error) {
      console.log("DELETE QUERY API ERROR............", error);
      toast.error(error.message);
    }
    toast.dismiss(toastId);
    return result;
  };
