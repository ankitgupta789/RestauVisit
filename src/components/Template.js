import React from 'react';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import { FcGoogle } from 'react-icons/fc';

const Template = ({ title, desc1, desc2, image, formtype }) => {
  return (
    <div className='flex flex-col items-center bg-white shadow-lg rounded-lg p-6 w-11/12 max-w-[480px] mt-4 mx-auto text-black border border-gray-200'>
      <h2 className='text-2xl font-bold text-gray-800'>{title}</h2>
      <p className='text-md text-gray-600 mt-2'>{desc1}</p>
      <p className='text-sm text-gray-500'>{desc2}</p>

      <div className='w-full mt-4'>
        {formtype === 'signup' ? <SignupForm /> : <LoginForm />}
      </div>

      <div className='flex items-center w-full my-4 gap-2'>
        <div className='flex-1 h-px bg-gray-300'></div>
        <p className='text-gray-500 text-sm'>OR</p>
        <div className='flex-1 h-px bg-gray-300'></div>
      </div>

      <button className='w-full flex justify-center items-center rounded-lg font-medium text-gray-700
            border border-gray-400 px-4 py-2 gap-2 hover:bg-gray-100 transition-all'>
        <FcGoogle className='text-xl' />
        <p>Sign Up with Google</p>
      </button>
    </div>
  );
};

export default Template;
