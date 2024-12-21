import React from 'react'
import logo1 from "../assets/logo1.png"
import {Link} from "react-router-dom"
import {toast} from "react-hot-toast"
import { useSelector  } from 'react-redux'
import {AiOutlineShoppingCart,AiOutlineMenu} from "react-icons/ai"
import ProfileDropDown from "./ProfileDropDown"
import { useEffect,useState } from 'react'
import { apiConnector } from '../services/apiconnector'
import {categories} from "../services/api"
import { useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from "../services/operations/authAPI"
import { HiArrowRightCircle } from "react-icons/hi2";
const Navbar = () => {
    const navigate=useNavigate();
    const dispatch = useDispatch()
    const{token} = useSelector((state) =>state.auth);
    const {user} =useSelector((state)=>state.profile );
    const {totalItems}=useSelector((state)=> state.cart); 

    const [showDocumentation, setShowDocumentation] = useState(false);
    const [subLinks,setSubLinks]=useState([]);
    

    const handleDocumentationHover = () => {
        setShowDocumentation(true);
    };

    const handleDocumentationLeave = () => {
        setShowDocumentation(false);
    };
    const handleExploreClick = () => {
        navigate('/exploreUniverse');
    };
    const handleExploreClick2 = () => {
        navigate('/solarSystem');
    };
    const handleExploreClick3 = () => {
        navigate('/spaceHistory');
    };
//  const fetchSublinks=async()=>{
//     try{
//       const result= await apiConnector("GET",categories.CATEGORIES_API);
//      console.log("printing sublinks",result);
//       setSubLinks(result.data.data);
//     }
//     catch(error){
//         console.log("could not fetch the list(categories)")
//     }
//    }
//     useEffect(()=>{
//        fetchSublinks();
//     },[])
//api call



    // let isLoggedIn = props.isLoggedIn;
    // let setIsLoggedIn = props.setIsLoggedIn;

  return (
    <div className='flex justify-between items-center w-11/12 max-w-[1160px] py-4 mx-auto'>

        <Link to="/"> 
            <img src={logo1} alt="Logo" width={160} height={20} loading="lazy"/>
        </Link>

        <nav>
            <ul className='text-richblack-100 flex gap-x-6'>

                {(user==null ||  user.accountType=="User") &&
                <li>
                    <Link to="/">Home</Link>
                </li>
                        }  
                {
                    user?.accountType==="Instructor" && user?.email!="ankitguptamanheru1@gmail.com"&&
                    <Link to="/addDocument">Publish Article</Link>
                }
                {
                        user?.accountType === "Student"&& user?.email!="ankitguptamanheru1@gmail.com" && (
                            <li>
                                <Link to="/mynotes">MyNotes</Link>
                            </li>
                        )
                    }
                    {
                        user?.accountType === "Instructor"&& user?.email!="ankitguptamanheru1@gmail.com" && (
                            <li>
                                <Link to="/myqueries">Queries</Link>
                            </li>
                        )
                    }
               {(user==null ||  user.accountType=="User") &&
                <li>
                    <Link to="/search">Search</Link>
                </li>
                }  
                {(user==null ||  user.accountType=="User") &&
                <li>
                    <Link to="/about">About_Us</Link>
                </li>
                        }  
               
                
                {(user==null ||  user.accountType=="User") &&
                <li>
                    <Link to="/reviews">Reviews</Link>
                </li>
                        }  
                {(user==null ||  user.accountType=="User") &&
                <li>
                    <Link to="/reserveSeat">Reserve_Seat</Link>
                </li>
                        }  

                {user?.accountType==="Restaurant"&&
                     <li>
                     <Link to="/photos">Photos</Link>
                   </li>
                }
                {
                    user?.accountType==="Restaurant" &&
                    <li>
                    <Link to="/menu">Menu</Link>
                </li>
                } 
                {
                    user?.accountType==="Restaurant" &&
                    <li>
                    <Link to="/myreviews">My_Reviews</Link>
                </li>
                } 
                {
                    user?.accountType==="Restaurant" &&
                    <li>
                    <Link to="/reservations">Reservations</Link>
                </li>
                } 
                 {
                    user&&
                    <li>
                    <Link to="/notifications">Notification</Link>
                </li>
                } 
               
            </ul>
        </nav>

        {/* Login - SignUp - LogOut - Dashboard */}
        {/* <div className='flex items-center gap-x-4'>
            { !isLoggedIn &&
                <Link to="/login">
                    <button className='bg-richblack-800 text-richblack-100 py-[8px] 
                    px-[12px] rounded-[8px] border border-richblack-700'>
                        Log in
                    </button>
                </Link>
            }
            { !isLoggedIn &&
                <Link to="/signup">
                    <button  className='bg-richblack-800 text-richblack-100 py-[8px] 
                    px-[12px] rounded-[8px] border border-richblack-700'>
                        Sign up
                    </button>
                </Link>
            }
            { isLoggedIn &&
                <Link to="/">
                    <button onClick={() => {
                        setIsLoggedIn(false);
                        toast.success("Logged Out");
                    }}
                    className='bg-richblack-800 text-richblack-100 py-[8px] 
                    px-[12px] rounded-[8px] border border-richblack-700'>
                        Log Out
                    </button>
                </Link>
            }
            { isLoggedIn &&
                <Link to="/dashboard">
                    <button
                     className='bg-richblack-800 text-richblack-100 py-[8px] 
                    px-[12px] rounded-[8px] border border-richblack-700'>
                        Dashboard
                    </button>
                </Link>
            }
        </div> */}
        <div className='flex gap-x-4 items-center'>

                {
                    user && user?.accountType != "Instructor" && (
                        <Link to="/dashboard/cart" className='relative'>
                            <span style={{ fontSize: '24px', color: 'yellow' }}>
                                    <AiOutlineShoppingCart />
                                </span>
                                {
                                    totalItems > 0 && (
                                        <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'yellow' }}>
                                            {totalItems}
                                        </span>
                                    )
                                }
                        </Link>
                    )
                }
                {
                    console.log(token,user)
                
                }
                {
                    token === null && (
                        <Link to="/login">
                            <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                                Log in
                            </button>
                        </Link>
                    )
                }
                {
                    token === null && (
                        <Link to="/signup">
                            <button  className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                                Sign Up
                            </button>
                        </Link>
                    )
                }
                {
                    token !== null && <ProfileDropDown />
                }
                {/* {
                    token!==null && <Link to="/dashboard">
                    <button
                     className='bg-richblack-800 text-richblack-100 py-[8px] 
                    px-[12px] rounded-[8px] border border-richblack-700'>
                        Dashboard
                    </button>
                </Link>

                }
                  */}
                  
                
                </div>
                



      
    </div>
  )
}

export default Navbar
