import toast from "react-hot-toast"
import axios from "axios"
import {logout} from "./authAPI"

export function deleteProfile(token, navigate) {
    return async (dispatch) => {
      const toastId = toast.loading("Loading...")
      try {
        const response=await axios.delete("http://localhost:4000/api/v1/profile/deleteProfile", null, {Authorization: `Bearer ${token}`, })
        console.log("DELETE_PROFILE_API API RESPONSE............", response)
      
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
        toast.success("Profile Deleted Successfully")
        dispatch(logout(navigate))
      }
       catch (error) {
        console.log("DELETE_PROFILE_API API ERROR............", error)
        toast.error("Could Not Delete Profile")
      }
      toast.dismiss(toastId)
    }
  }