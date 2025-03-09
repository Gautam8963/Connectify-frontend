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
    // <div className="flex justify-center my-10">
    //   <div className="card bg-base-300 w-96 shadow-xl">
    //     <div className="card-body">
    //       <h2 className="card-title justify-center">
    //         {isLoginForm ? "Login" : "Sign Up"}
    //       </h2>
    //       <div>
    //         {!isLoginForm && (
    //           <>
    //             <label className="form-control w-full max-w-xs my-2">
    //               <div className="label">
    //                 <span className="label-text">First Name</span>
    //               </div>
    //               <input
    //                 type="text"
    //                 value={firstName}
    //                 className="input input-bordered w-full max-w-xs"
    //                 onChange={(e) => setFirstName(e.target.value)}
    //               />
    //             </label>
    //             <label className="form-control w-full max-w-xs my-2">
    //               <div className="label">
    //                 <span className="label-text">Last Name</span>
    //               </div>
    //               <input
    //                 type="text"
    //                 value={lastName}
    //                 className="input input-bordered w-full max-w-xs"
    //                 onChange={(e) => setLastName(e.target.value)}
    //               />
    //             </label>
    //           </>
    //         )}
    //         <label className="form-control w-full max-w-xs my-2">
    //           <div className="label">
    //             <span className="label-text">Email ID:</span>
    //           </div>
    //           <input
    //             type="text"
    //             value={emailId}
    //             className="input input-bordered w-full max-w-xs"
    //             onChange={(e) => setEmailId(e.target.value)}
    //           />
    //         </label>
    //         <label className="form-control w-full max-w-xs my-2">
    //           <div className="label">
    //             <span className="label-text">Password</span>
    //           </div>
    //           <input
    //             type="password"
    //             value={password}
    //             className="input input-bordered w-full max-w-xs"
    //             onChange={(e) => setPassword(e.target.value)}
    //           />
    //         </label>
    //       </div>
    //       <p className="text-red-500">{error}</p>
    //       <div className="card-actions justify-center m-2">
    //         <button
    //           className="btn btn-primary"
    //           onClick={isLoginForm ? handleLogin : handleSignUp}
    //         >
    //           {isLoginForm ? "Login" : "Sign Up"}
    //         </button>
    //       </div>

    //       <p
    //         className="m-auto cursor-pointer py-2"
    //         onClick={() => setIsLoginForm((value) => !value)}
    //       >
    //         {isLoginForm
    //           ? "New User? Signup Here"
    //           : "Existing User? Login Here"}
    //       </p>
    //     </div>
    //   </div>
    // </div>
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 p-4">
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card bg-base-300 w-full max-w-md shadow-xl"
    >
      <div className="card-body">
        <h2 className="card-title justify-center text-2xl">
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
                <label className="form-control w-full my-2">
                  <div className="label">
                    <span className="label-text">First Name</span>
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    placeholder="Enter your first name"
                    className="input input-bordered w-full"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
                <label className="form-control w-full my-2">
                  <div className="label">
                    <span className="label-text">Last Name</span>
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    placeholder="Enter your last name"
                    className="input input-bordered w-full"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
              </motion.div>
            )}
          </AnimatePresence>
          <label className="form-control w-full my-2">
            <div className="label">
              <span className="label-text">Email ID:</span>
            </div>
            <div className="input-group">
              <input
                type="text"
                value={emailId}
                placeholder="Enter your email"
                className="input input-bordered w-full"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </div>
          </label>
          <label className="form-control w-full my-2">
            <div className="label">
              <span className="label-text">Password</span>
            </div>
            <div className="input-group">
              <input
                type="password"
                value={password}
                placeholder="Enter your password"
                className="input input-bordered w-full"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </label>
        </div>
        {error && (
          <div className="alert alert-error my-2">
            <span>{error}</span>
          </div>
        )}
        <div className="card-actions justify-center m-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary w-full"
            onClick={isLoginForm ? handleLogin : handleSignUp}
          >
            {isLoginForm ? 'Login' : 'Sign Up'}
          </motion.button>
        </div>
        <button
          className="btn btn-link w-full"
          onClick={() => setIsLoginForm((value) => !value)}
        >
          {isLoginForm ? 'New User? Signup Here' : 'Existing User? Login Here'}
        </button>
      </div>
    </motion.div>
  </div>

  );
};
export default Login;