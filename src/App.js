import { Route, Routes,Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar.js"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
//import Dashboard from "./pages/Dashboard"
import ForgotPassword from "./pages/ForgotPassword";
import { useEffect, useState } from 'react'
import PrivateRoute from "./components/PrivateRoute";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import MyProfile from "./pages/MyProfile";
import AddDocument from "./pages/AddDocument"
import {addfeedback} from "./services/operations/feedback"
import { useSelector } from "react-redux";
import Reviews from './components/Reviews.js'
import ExploreUniverse from "./pages/ExploreUniverse"
import SpaceHistory from "./pages/SpaceHistory"
import SolarSystem from "./pages/SolarSystem"
import MyDoc from "./pages/MyDoc";
import MyQueries from "./components/MyQueries.js";
import About from "./pages/About";
import MyNotes from "./pages/MyNotes.js";
import CreateQuestion from "./pages/CreateQuestion.js";
import Drafts from "./pages/Drafts.js";
import Practice from "./pages/Practice.js";
import Exercise from "./pages/Exercise.js";
import Search from "./components/Search.js";
import Reserve from "./components/Reserve.js";
import Photos from "./components/Photos.js";
import Menu from "./components/Menu.js";
import MyReviews from "./components/MyReviews.js";
import Reservations from "./components/Reservations.js"
import OrderHistory from "./pages/OrderHistory.js"
import SearchedRestaurant from "./components/SearchedRestaurant.js";
import Cart from "./pages/Cart.js";
import Orders from "./pages/Orders.js";
import Analytics from "./pages/Analytics/Analytics.js";
import RestauReviews from "./components/Reviews/RestauReviews.js";
import ReviewsByUser from "./pages/Reviews.jsx"
//import Navbar from "./components/Navbar";
function App() {
  const{token} = useSelector((state) =>state.auth);
  const {user} =useSelector((state)=>state.profile );

  //const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modal, setModal] = useState(false);
  const [data, setData] = useState({
    
    email: "",
    content: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData({ ...data, [name]: value });
  };

  const HandleSubmit = (e) => {
    e.preventDefault();
    if (
  
      data.email.length !== 0 &&
      data.content.length !== 0
    ) {
      const {email,content}=data;
      
      addfeedback({email,content});
      setModal((value) => !value)
    } else {
      alert("Enter data first");
    }
  };

  return (
    
      
      <Routes>

        <Route path="/" element= {<Home/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/login" element = {<Login />} />
        <Route path="/signup" element={<Signup  />} />
        <Route path="/forgotpassword" element={<ForgotPassword/>} />
        <Route path="/update-password/:id" element={<UpdatePassword/>} />
        <Route path="/verifyemail" element={<VerifyEmail/>} />
        <Route path="/exploreUniverse" element={user ? <ExploreUniverse/>: <Login/>} />
        <Route path="/solarSystem" element={user ? <SolarSystem/>: <Login/>} />
        <Route path="/spaceHistory" element={user ? <SpaceHistory/>: <Login/>} />
        
       
        
        <Route path="/drafts" element={<Drafts/>}/>
        <Route path="/search" element={<Search/>}/>
        {/* <Route path="/reviews" element={<Reviews/>}/> */}
        <Route 
            path="/reserveSeat" 
            element={user && user.accountType === "User" ? <Reserve /> : <Login />} 
        />
        <Route 
            path="/searchedRestaurant" 
            element={user && user.accountType === "User" ? <SearchedRestaurant /> : <Login />} 
        />
 
        <Route 
            path="/photos" 
            element={user && user.accountType === "Restaurant" ? <Photos /> : <Login />} 
        />
        <Route 
            path="/menu" 
            element={user && user.accountType === "Restaurant" ? <Menu /> : <Login />} 
        />
        {/* <Route 
            path="/myreviews" 
            element={user && user.accountType === "Restaurant" ? <MyReviews /> : <Login />} 
        /> */}
         <Route 
            path="/reservations" 
            element={user && user.accountType === "Restaurant" ? <Reservations /> : <Login />} 
        />
        <Route path="/orderHistory" element={user ? <OrderHistory/>: <Login/>} />

        <Route path="/allrestaurants" element={user ? <ReviewsByUser/>: <Login/>} />

        <Route path="/my-profile" element={ user?< MyProfile />:<Login/>}/> 
        
        {user?.accountType==='Instructor'
        
        &&<Route path="/myqueries" element={user?<MyQueries/>:<Login/>} />
        }
        {user?.accountType==='Instructor'
        
        && <Route path ="/addQuestion"  element={<CreateQuestion/>}/>
        }
        {user?.accountType==='Restaurant'
        
        &&<Route path="/myorders" element={user?<Orders/>:<Login/>} />
        }
        
        {user?.accountType==='Restaurant'
        
        &&<Route path="/myReviews" element={user?<RestauReviews userId={user._id}/>:<Login/>} />
        }


        {user?.accountType==='Student'
        && <Route path="/mynotes"element={user?<MyNotes/>:<Login/>}/>
        }
        {user?.accountType==='Student'
        &&<Route path ="/practice"  element={<Practice/>}/>
        }
        {user?.accountType==='Student'
        &&<Route path="/exercise" element={<Exercise/>}/>
        }
        <Route 
            path="/analytics" 
            element={user && user.accountType === "Restaurant" ? <Analytics /> : <Login />} 
        />
        
       
        
        
        </Routes>
  
    )
}

export default App;
