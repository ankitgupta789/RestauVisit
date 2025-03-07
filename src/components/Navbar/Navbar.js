import React from "react";
import logo1 from "../../assets/logo1.png";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { AiOutlineShoppingCart, AiOutlineMenu } from "react-icons/ai";
import ProfileDropDown from "../ProfileDropDown";
import { useEffect, useState } from "react";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../services/operations/authAPI";
import { HiArrowRightCircle } from "react-icons/hi2";
const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  const [showDocumentation, setShowDocumentation] = useState(false);
  const [subLinks, setSubLinks] = useState([]);

  const handleDocumentationHover = () => {
    setShowDocumentation(true);
  };

  const handleDocumentationLeave = () => {
    setShowDocumentation(false);
  };
  const handleExploreClick = () => {
    navigate("/exploreUniverse");
  };
  const handleExploreClick2 = () => {
    navigate("/solarSystem");
  };
  const handleExploreClick3 = () => {
    navigate("/spaceHistory");
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
    <div className="items-center bg-blue-50">
      <div className="flex justify-between items-center w-11/12 max-w-[1160px] py-4 mx-auto ">
        <Link to="/">
          <img src={logo1} alt="Logo" width={160} height={20} loading="lazy" />
        </Link>

        <nav>
          <ul className="text-black flex gap-x-6">
            {(user == null || user.accountType == "User") && (
              <li>
                <Link to="/">Home</Link>
              </li>
            )}

            {(user == null || user.accountType == "User") && (
              <li>
                <Link to="/search">Search</Link>
              </li>
            )}
            {(user == null || user.accountType == "User") && (
              <li>
                <Link to="/about">About_Us</Link>
              </li>
            )}

            {(user == null || user.accountType == "User") && (
              <li>
                <Link to="/reviews">Reviews</Link>
              </li>
            )}

            {user?.accountType === "Restaurant" && (
              <li>
                <Link to="/photos">Photos</Link>
              </li>
            )}
            {user?.accountType === "Restaurant" && (
              <li>
                <Link to="/menu">Menu</Link>
              </li>
            )}
            {user?.accountType === "Restaurant" && (
              <li>
                <Link to="/myReviews">My_Reviews</Link>
              </li>
            )}
            {user?.accountType === "Restaurant" && (
              <li>
                <Link to="/reservations">Reservations</Link>
              </li>
            )}
            {user?.accountType === "User" && (
              <li>
                <Link to="/orderHistory">Order_History</Link>
              </li>
            )}
            {user?.accountType === "Restaurant" && (
              <li>
                <Link to="/analytics">Analytics</Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="flex gap-x-4 items-center">
          {user && user?.accountType == "User" && (
            <Link to="/cart" className="relative">
              <span style={{ fontSize: "24px", color: "yellow" }}>
                <AiOutlineShoppingCart />
              </span>
              {totalItems > 0 && (
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "yellow",
                  }}
                >
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {user && user?.accountType == "Restaurant" && (
            <Link to="/myorders" className="relative">
              <span style={{ fontSize: "24px", color: "yellow" }}>
                <AiOutlineShoppingCart />
              </span>
              {totalItems > 0 && (
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "yellow",
                  }}
                >
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {console.log(token, user)}
          {token === null && (
            <Link to="/login">
              <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                Sign Up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropDown />}
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
    </div>
  );
};

export default Navbar;
