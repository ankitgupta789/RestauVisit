import { Route, Routes } from "react-router-dom";
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
//import Navbar from "./components/Navbar";
function App() {

  //const [isLoggedIn, setIsLoggedIn] = useState(false);
 

  return (
    <div className="w-screen h-screen bg-richblack-900 flex flex-col">
      <Navbar/>

      <Routes>

        <Route path="/" element= {<Home/>} />
        <Route path="/login" element = {<Login />} />
        <Route path="/signup" element={<Signup  />} />
        <Route path="/forgotpassword" element={<ForgotPassword/>} />
        <Route path="/update-password/:id" element={<UpdatePassword/>} />
        <Route path="/verifyemail" element={<VerifyEmail/>} />
       
        {/* <Route path="/dashboard/my-profile" element={<MyProfile/>} /> */}
        <Route path="/dashboard" element = {
          <PrivateRoute>
              <Dashboard/>
          </PrivateRoute>
       
        } />
        <Route path="/dashboard/my-profile" element={ < MyProfile />} /> 
        <Route path="/dashboard/addDocument" element={ < AddDocument />} /> 

      </Routes>

    </div>
    )
}

export default App;
