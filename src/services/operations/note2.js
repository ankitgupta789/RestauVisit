import {toast} from "react-hot-toast"
import axios from "axios"

export const addnote = async (note, email, documentName
 ) => {
    let result = null
    const toastId = toast.loading("Loading...");
    try {
        console.log("hello",note,email,documentName);
        const response= await axios.post("http://localhost:4000/api/v1/note/createNote",
        {note, email, documentName
      })
      
      toast.success("note Details Added Successfully")
      result="Done"
      // result = response?.data?.data
    }
     catch (error) {
      console.log("CREATE Note API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
  };
  export const getAllNote = async () => {
    let result = null;
    const toastId = toast.loading("Loading...");

    try {
        const response = await axios.get("http://localhost:4000/api/v1/note/getAllNote");
        result = response.data;
        toast.success("Notes Fetched Successfully");
    } catch (error) {
        console.log("GET ALL NOTES API ERROR............", error);
        toast.error(error.message);
    }
    toast.dismiss(toastId);
    return result;
};
export const deleteNote = async (noteId) => {
  let result = null;
  const toastId = toast.loading("Deleting...");
  try {
    const response = await axios.delete(`http://localhost:4000/api/v1/note/deleteNote/${noteId}`);
    toast.success("Note Deleted Successfully");
    result = response.data;
  } catch (error) {
    console.log("DELETE NOTE API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};
