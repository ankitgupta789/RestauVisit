import { useState } from "react"
import { VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { sidebarLinks } from "./Dashlinks"
import { logout } from "../services/operations/authAPI"
//import ConfirmationModal from "../../common/ConfirmationModal"
import OneSideLink from "./OneSideLink"



export default function Sidebar(){

  const { user, loading: profileLoading } = useSelector( (state) => state.profile )
  const { loading: authLoading } = useSelector((state) => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [confirmationModal, setConfirmationModal] = useState(null)               // to keep track of confirmation modal

  if(profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <>
      <div className="flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10">
        <div className="flex flex-col">
           
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null
            return (
               
              <OneSideLink key={link.id} link={link} iconName={link.icon} />
            )
          })}
           {/* {
            console.log("hii guys")
           } */}
        </div>
        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />
        <div className="flex flex-col">
         
          <button className="px-8 py-2 text-sm font-medium text-richblack-300"
            onClick={() =>
                dispatch(logout(navigate))
            }
          >
            <div className="flex items-center gap-x-2">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>
      
    </>
  )
}