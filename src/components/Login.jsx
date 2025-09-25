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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="card w-full max-w-md rounded-2xl shadow-xl bg-white overflow-hidden border border-indigo-100"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 h-2"></div>
        </div>
        
        <div className="card-body p-6 sm:p-10">
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {isLoginForm ? 'Connect with Devs' : 'Join the Community'}
          </h2>
          
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
                      className="input input-bordered w-full rounded-lg border-indigo-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 transition-all duration-200 text-gray-800"
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
                      className="input input-bordered w-full rounded-lg border-indigo-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 transition-all duration-200 text-gray-800"
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
                className="input input-bordered w-full rounded-lg border-indigo-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 transition-all duration-200 text-gray-800"
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
                className="input input-bordered w-full rounded-lg border-indigo-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 transition-all duration-200 text-gray-800"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="alert bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
          
          <div className="card-actions mt-8">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              className="btn w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-none rounded-lg py-3 h-12 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              onClick={isLoginForm ? handleLogin : handleSignUp}
            >
              {isLoginForm ? 'Log In' : 'Create Account'}
            </motion.button>
          </div>
          
          <div className="divider text-gray-400 text-sm my-6">OR</div>
          
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="btn btn-outline border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 w-full rounded-lg font-medium"
            onClick={() => setIsLoginForm((value) => !value)}
          >
            {isLoginForm ? 'Create a new account' : 'Already have an account?'}
          </motion.button>
          
          {isLoginForm && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Find your perfect coding partner
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;