import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-pink-500 to-yellow-200 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="card-body p-8">
          <h2 className="card-title justify-center text-3xl font-bold mb-6 text-pink-600">
            {isLoginForm ? 'Login' : 'Sign Up'}
          </h2>
          <div>
            <AnimatePresence>
              {!isLoginForm && (
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="form-control w-full mb-4">
                    <input
                      type="text"
                      value={firstName}
                      placeholder="First Name"
                      className="input input-bordered w-full rounded-full bg-pink-50 focus:ring-pink-300 focus:border-pink-300" // Added color to input
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </label>
                  <label className="form-control w-full mb-4">
                    <input
                      type="text"
                      value={lastName}
                      placeholder="Last Name"
                      className="input input-bordered w-full rounded-full bg-pink-50 focus:ring-pink-300 focus:border-pink-300" // Added color to input
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </label>
                </motion.div>
              )}
            </AnimatePresence>
            <label className="form-control w-full mb-4">
              <input
                type="text"
                value={emailId}
                placeholder="Email"
                className="input input-bordered w-full rounded-full bg-pink-50 focus:ring-pink-300 focus:border-pink-300" // Added color to input
                onChange={(e) => setEmailId(e.target.value)}
              />
            </label>
            <label className="form-control w-full mb-6"> {/* increased margin to mb-6 */}
              <input
                type="password"
                value={password}
                placeholder="Password"
                className="input input-bordered w-full rounded-full bg-pink-50 focus:ring-pink-300 focus:border-pink-300" // Added color to input
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>
          {error && (
            <div className="alert alert-error my-2 rounded-full">
              <span>{error}</span>
            </div>
          )}
          <div className="card-actions justify-center mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary w-full rounded-full bg-pink-600 border-none hover:bg-pink-700 text-white"
              onClick={isLoginForm ? handleLogin : handleSignUp}
            >
              {isLoginForm ? 'Login' : 'Sign Up'}
            </motion.button>
          </div>
          <button
            className="btn btn-link w-full mt-4 text-pink-600"
            onClick={() => setIsLoginForm((value) => !value)}
          >
            {isLoginForm ? 'New User? Sign Up' : 'Already have an account? Login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
export default Login;