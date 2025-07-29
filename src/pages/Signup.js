import React from 'react'
import signupImg from "../assets/signup.png"
import Template from '../components/Template'
import Navbar from '../components/Navbar/Navbar2'

const Signup = ({setIsLoggedIn}) => {
  return (
    <div className='min-h-screen h-screen flex flex-col items-center gap-6 bg-gray-50'>
      <Navbar />

      <p className='text-lg text-center leading-6 mt-6 max-w-[400px] text-gray-800'>
        <span className='font-semibold'>Want the best dining option in your city?</span>
        <br />
        <span className='italic text-blue-600'>RestauVisit is the best option—try it now!</span>
      </p>
      
    <Template
      title="Join the millions discovering great dining experiences with RestauVisit"
      desc1="Find your next favorite restaurant or manage your own effortlessly."
      desc2="Your go-to platform for the best dining experience."
      image={signupImg}
      formtype="signup"
      setIsLoggedIn={setIsLoggedIn}
    />
    
    </div>
  )
}

export default Signup
