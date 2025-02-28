import { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getPasswordResetToken } from "../services/operations/authAPI";
import Navbar from "../components/Navbar/Navbar";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(getPasswordResetToken(email, setEmailSent));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex flex-grow items-center justify-center">
        {loading ? (
          <div className="spinner border-t-4 border-blue-500 border-solid w-8 h-8 rounded-full animate-spin"></div>
        ) : (
          <div className="w-full max-w-[500px] bg-white shadow-lg rounded-lg p-6 lg:p-8 border border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-800">
              {!emailSent ? "Reset your password" : "Check your email"}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {!emailSent
                ? "No worries, we'll send you instructions to reset your password. If you don’t have access to your email, try account recovery."
                : `A reset email has been sent to: `}
              <span className="font-medium text-blue-600">{email}</span>
            </p>

            <form onSubmit={handleOnSubmit} className="mt-6">
              {!emailSent && (
                <label className="block">
                  <p className="mb-1 text-sm font-medium text-gray-700">
                    Email Address <sup className="text-red-500">*</sup>
                  </p>
                  <input
                    required
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              )}

              <button
                type="submit"
                className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-all"
              >
                {!emailSent ? "Submit" : "Resend Email"}
              </button>
            </form>

            <div className="mt-6 flex justify-between items-center">
              <Link to="/login" className="text-blue-600 hover:underline flex items-center gap-2">
                <BiArrowBack /> Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
