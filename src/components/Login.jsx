import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="card w-full max-w-md rounded-3xl shadow-2xl bg-white overflow-hidden border border-gray-100 animate-card-appear"
      >
        <div className="relative">
          <div className="absolute inset-0 tinder-gradient h-2"></div>
        </div>

        <div className="card-body p-6 sm:p-10">
          {/* Logo/Title with Flame */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-4xl">🔥</span>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#FF4458]">
                Connectify
              </h1>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
              {isLoginForm ? 'Find Your Dev Match' : 'Join the Community'}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {isLoginForm ? 'Connect with developers worldwide' : 'Start your coding journey'}
            </p>
          </div>

          <div>
            <AnimatePresence mode="wait">
              {!isLoginForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text text-gray-600 font-medium">First Name</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      placeholder="Your first name"
                      className="input input-bordered w-full rounded-xl border-gray-200 bg-white focus:border-[#FF4458] focus:ring-2 focus:ring-[#FF4458]/20 transition-all duration-200 text-gray-800"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text text-gray-600 font-medium">Last Name</span>
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      placeholder="Your last name"
                      className="input input-bordered w-full rounded-xl border-gray-200 bg-white focus:border-[#FF4458] focus:ring-2 focus:ring-[#FF4458]/20 transition-all duration-200 text-gray-800"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={`form-control w-full ${isLoginForm ? "" : "mt-4"}`}>
              <label className="label">
                <span className="label-text text-gray-600 font-medium">Email</span>
              </label>
              <input
                type="email"
                value={emailId}
                placeholder="your.email@example.com"
                className="input input-bordered w-full rounded-xl border-gray-200 bg-white focus:border-[#FF4458] focus:ring-2 focus:ring-[#FF4458]/20 transition-all duration-200 text-gray-800"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </div>

            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text text-gray-600 font-medium">Password</span>
              </label>
              <input
                type="password"
                value={password}
                placeholder="••••••••"
                className="input input-bordered w-full rounded-xl border-gray-200 bg-white focus:border-[#FF4458] focus:ring-2 focus:ring-[#FF4458]/20 transition-all duration-200 text-gray-800"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="alert bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mt-6 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          <div className="card-actions mt-8">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(255, 68, 88, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="btn w-full tinder-gradient text-white border-none rounded-full py-3 h-14 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={isLoginForm ? handleLogin : handleSignUp}
            >
              {isLoginForm ? 'Log In' : 'Create Account'}
            </motion.button>
          </div>

          <div className="divider text-gray-400 text-sm my-6">OR</div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="btn btn-outline border-2 border-[#FF4458] text-[#FF4458] hover:bg-[#FF4458] hover:text-white hover:border-[#FF4458] w-full rounded-full font-semibold transition-all duration-300"
            onClick={() => setIsLoginForm((value) => !value)}
          >
            {isLoginForm ? 'Create a new account' : 'Already have an account?'}
          </motion.button>

          {isLoginForm && (
            <p className="text-center text-sm text-gray-500 mt-6">
              Swipe right on your coding career 💻
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;