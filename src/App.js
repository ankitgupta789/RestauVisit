import { Route, Routes,Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import ForgotPassword from "./pages/ForgotPassword";
import { useEffect, useState } from 'react'
import PrivateRoute from "./components/PrivateRoute";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import MyProfile from "./pages/MyProfile";
import AddDocument from "./pages/AddDocument"
import {addfeedback} from "./services/operations/feedback"
import { useSelector } from "react-redux";
import Chats from './components/Chats-ChatsHome/Chats.js'
import ExploreUniverse from "./pages/ExploreUniverse"
import SpaceHistory from "./pages/SpaceHistory"
import SolarSystem from "./pages/SolarSystem"
import MyDoc from "./pages/MyDoc";

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
    <div className="w-screen h-screen bg-richblack-900 flex flex-col">
      <Navbar className="relative"/>
      
      {user && <div className="absolute bottom-20 right-10 z-20">
    {!modal && (
      <button
        className="bg-blue-100 text-white font-bold py-2 px-4 rounded close-btn animate-bounce"
        onClick={() => setModal((value) => !value)}
      >
        Toggle Feedback
      </button>
    )}
    <div>
      {modal && (
        <form className="feedback bg-white rounded-lg shadow-lg p-8" onSubmit={HandleSubmit}>
          <button
            className="close-btn-form absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={() => setModal((value) => !value)}
          >
            X
          </button>
         
          <div className="my-6">
            <input
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-400"
              placeholder="Email"
              name="email"
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          <div className="my-6">
            <textarea
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-400 h-48 resize-none"
              placeholder="Feedback"
              name="content"
              onChange={(e) => handleChange(e)}
              required
            ></textarea>
          </div>
          <button className="bg-blue-200 w-full" onClick={HandleSubmit}>
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  </div>
}
      
      <Routes>

        <Route path="/" element= {<Home/>} />
        <Route path="/login" element = {<Login />} />
        <Route path="/signup" element={<Signup  />} />
        <Route path="/forgotpassword" element={<ForgotPassword/>} />
        <Route path="/update-password/:id" element={<UpdatePassword/>} />
        <Route path="/verifyemail" element={<VerifyEmail/>} />
        <Route path="/exploreUniverse" element={user ? <ExploreUniverse/>: <Login/>} />
        <Route path="/solarSystem" element={user ? <SolarSystem/>: <Login/>} />
        <Route path="/spaceHistory" element={user ? <SpaceHistory/>: <Login/>} />
        <Route path="/mydoc" element={<MyDoc/>} />
       
        {/* <Route path="/dashboard/my-profile" element={<MyProfile/>} /> */}
        <Route path="/dashboard" element = {
          <PrivateRoute>
              <Dashboard/>
          </PrivateRoute>
       
        } />

        <Route path="/dashboard/my-profile" element={ < MyProfile />} /> 
        <Route path="/dashboard/addDocument" element={ < AddDocument />} /> 
        <Route path="/community" element={<Chats/>}/>

        </Routes>
     
    </div>
    )
}

export default App;
