import React from 'react'
import logo from "../assets/Logo.svg"
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
            <img src={logo} alt="Logo" width={160} height={32} loading="lazy"/>
        </Link>

        <nav>
            <ul className='text-richblack-100 flex gap-x-6'>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/">Feedbacks</Link>
                </li>
                <li>
                    <Link to="/">Contact</Link>
                </li>
                <li>
                    <Link to="/">Join Community</Link>
                </li>
                <li>
            <div className="relative" onMouseEnter={handleDocumentationHover} onMouseLeave={handleDocumentationLeave}>
                <button className="hover:text-gray-900 focus:outline-none">Documentation</button>
                {showDocumentation && (
                    <div className="absolute top-4 left-1 w-[250px] bg-white border border-gray-200 rounded-md shadow-md p-4 mt-2 z-10 text-lg">
                        <ul>
                            <li className="py-2 px-4 hover:bg-blue-100 hover:text-white">
                                <a href="#" className="text-gray-800 hover:text-gray-900 flex items-center">
                                <button onClick={handleExploreClick}>
                                    <span>Explore Universe</span>
                                </button>
                                    <HiArrowRightCircle className="ml-10 text-gray-500 hover:text-gray-700" />
                                </a>
                            </li>
                            <li className="py-2 px-4 hover:bg-blue-100 hover:text-white">
                                <a href="#" className="text-gray-800 hover:text-gray-900 flex items-center">
                                <button onClick={handleExploreClick2}>
                                <span>Discover Solar System</span>
                                </button>
                                    
                                    <HiArrowRightCircle className="ml-2 text-gray-500 hover:text-gray-700" />
                                </a>
                            </li>
                            <li className="py-2 px-4 hover:bg-blue-100 hover:text-white">
                                <a href="#" className="text-gray-800 hover:text-gray-900 flex items-center">
                                    
                                    <button onClick={handleExploreClick3}>
                                    <span>Space History</span>
                                </button>
                                    <HiArrowRightCircle className="ml-2 text-gray-500 hover:text-gray-700" />
                                </a>
                            </li>
                            {/* Add more hardcoded links as needed */}
                        </ul>
                    </div>
                )}
            </div>
        </li>
                <li>
                    <Link to="/">Quizes</Link>
                </li>
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
