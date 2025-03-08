import React from 'react';
import Template from '../components/Template';
import loginImg from "../assets/login.png";
import Navbar from '../components/Navbar/Navbar2.jsx';

const Login = () => {
  return (
    <div className='min-h-screen flex flex-col items-center gap-6 bg-gray-50'>
      <Navbar />

      <p className='text-lg text-center leading-6 mt-6 max-w-[400px] text-gray-800'>
        <span className='font-semibold'>Want the best dining option in your city?</span>
        <br />
        <span className='italic text-blue-600'>RestauVisit is the best option—try it now!</span>
      </p>

      <Template
        title="Welcome Back"
        desc1="Build skills for today, tomorrow, and beyond."
        desc2="Education to future-proof your career."
        image={loginImg}
        formtype="login"
      />
    </div>
  );
};

export default Login;
