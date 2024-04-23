import { RiEditBoxLine } from "react-icons/ri"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { deleteProfile } from "../services/operations/profile"
import { FiTrash2 } from "react-icons/fi"


export default function MyProfile(){

  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const dispatch=useDispatch()
  const { token } = useSelector((state) => state.auth)

  async function handleDeleteAccount() {
   
    try {
        
      dispatch(deleteProfile(token, navigate))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (

    <>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5"> My Profile </h1>
        
      <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
       
        <div className="flex items-center gap-x-4">
          <img src={user?.image} alt={`profile-${user?.firstName}`} className="aspect-square w-[78px] rounded-full object-cover"  />
          
          <div className="space-y-1">
            <p className="text-lg font-semibold text-richblack-5"> {user?.firstName + " " + user?.lastName} </p>
            <p className="text-sm text-richblack-300">{user?.email}</p>
          </div>
        </div>
        
      </div>

      <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
     
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-richblack-5">About</p>
          
        </div>
        <p className={`${user?.additionalDetails?.about ? "text-richblack-5" : "text-richblack-400"} text-sm font-medium`} >
          {user?.additionalDetails?.about ?? "Write Something About Yourself"}
        </p>

      </div>

      <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
       
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-richblack-5"> Personal Details </p>
         
        </div>

        <div className="flex max-w-[500px] justify-between">

          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-richblack-600">First Name</p>
              <p className="text-sm font-medium text-richblack-5"> {user?.firstName} </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Email</p>
              <p className="text-sm font-medium text-richblack-5"> {user?.email} </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Gender</p>
              <p className="text-sm font-medium text-richblack-5"> {user?.additionalDetails?.gender ?? "Add Gender"} </p>
            </div>
          </div>

          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-richblack-600">Last Name</p>
              <p className="text-sm font-medium text-richblack-5"> {user?.lastName} </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Phone Number</p>
              <p className="text-sm font-medium text-richblack-5"> {user?.additionalDetails?.contactNumber ?? "Add Contact Number"} </p>
            </div>
           
          </div>
          <div className="my-10 flex flex-row gap-x-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-8 px-12">
       
        <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700">
          <FiTrash2 className="text-3xl text-pink-200" />
        </div>
        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-semibold text-richblack-5"> Delete Account </h2>
          
          <button  type="button"  className="w-fit cursor-pointer italic text-pink-300"  onClick={handleDeleteAccount} >
            I want to delete my account.
          </button>
        </div>
     
      </div>
          
        </div>

      </div>

    </>
  
)}