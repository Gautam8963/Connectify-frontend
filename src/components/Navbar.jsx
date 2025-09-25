import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { motion } from 'framer-motion';
import React from 'react';

const NavBar = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      return navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest('.profile-dropdown')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  return (
    <div className="sticky top-0 z-30 w-full backdrop-blur bg-white/90 border-b border-indigo-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-4">
        <div className="navbar h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center flex-1">
            <Link to="/" className="flex items-center">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Connectify
              </span>
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                Devs
              </span>
            </Link>
          </div>

          {/* Hamburger for mobile */}
          <div className="sm:hidden flex items-center">
            <button
              className="btn btn-ghost btn-circle"
              aria-label="Open menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Desktop user info and dropdown (click to open) */}
          {user && (
            <div className="hidden sm:flex items-center gap-3 sm:gap-5">
              <div className="text-sm text-gray-600 font-medium">
                Welcome, <span className="text-indigo-600 ml-1">{user.firstName}</span>
              </div>
              <div className="relative profile-dropdown">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  tabIndex={0}
                  role="button"
                  className="btn btn-circle avatar bg-white border-2 border-indigo-200 hover:border-indigo-400 p-1 transition-all duration-200"
                  style={{ width: 36, height: 36 }}
                  onClick={() => setDropdownOpen((open) => !open)}
                >
                  {user.photoUrl ? (
                    <div className="w-full h-full rounded-full overflow-hidden" style={{ width: 32, height: 32 }}>
                      <img 
                        alt={`${user.firstName}'s profile photo`} 
                        src={user.photoUrl} 
                        className="object-cover w-full h-full"
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold" style={{ width: 32, height: 32, fontSize: '1rem' }}>
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </div>
                  )}
                </motion.div>
                {dropdownOpen && (
                  <div tabIndex={0} className="absolute right-0 mt-2 dropdown-content z-[1] w-64 overflow-hidden">
                    <div className="shadow-xl rounded-xl text-indigo-600 bg-white border border-indigo-100">
                      <div className="bg-gradient-to-r rounded-t-xl from-indigo-600 to-purple-600 px-4 py-3">
                        <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-indigo-100 text-xs mt-1">{user.emailId}</p>
                      </div>
                      <ul className="menu p-2">
                        <li>
                          <Link to="/profile" className="flex items-center px-4 py-2 hover:bg-indigo-50 rounded-lg group" onClick={() => setDropdownOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            Profile
                            <span className="ml-auto px-2 py-1 text-xs bg-indigo-500 text-white rounded-full">New</span>
                          </Link>
                        </li>
                        <li>
                          <Link to="/connections" className="flex items-center px-4 py-2 hover:bg-indigo-50 rounded-lg" onClick={() => setDropdownOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                            Connections
                          </Link>
                        </li>
                        <li>
                          <Link to="/requests" className="flex items-center px-4 py-2 hover:bg-indigo-50 rounded-lg" onClick={() => setDropdownOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                            </svg>
                            Requests
                          </Link>
                        </li>
                        <li>
                          <Link to="/premium" className="flex items-center px-4 py-2 hover:bg-indigo-50 rounded-lg" onClick={() => setDropdownOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Premium
                          </Link>
                        </li>
                        <div className="divider my-1"></div>
                        <li>
                          <button 
                            onClick={() => { handleLogout(); setDropdownOpen(false); }} 
                            className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414a1 1 0 00-.293-.707L11.414 2.414A1 1 0 0010.707 2H4a1 1 0 00-1 1zm0 2.5V16h12V9h-3.5a1.5 1.5 0 01-1.5-1.5V4H3.5zm9-1v-.086l2.086 2.086H12.5a.5.5 0 01-.5-.5zM6 12a1 1 0 100-2 1 1 0 000 2zm0 1a2 2 0 110-4 2 2 0 010 4zm5-2a1 1 0 100-2 1 1 0 000 2zm0 1a2 2 0 110-4 2 2 0 010 4z" clipRule="evenodd" />
                            </svg>
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile menu */}
          {user && menuOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={() => setMenuOpen(false)}></div>
          )}
          {user && (
            <div className={`sm:hidden fixed top-0 right-0 z-50 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-4 py-4 border-b">
                  <div className="flex items-center gap-2">
                    {user.photoUrl ? (
                      <img src={user.photoUrl} alt="profile" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </div>
                    )}
                    <span className="font-semibold text-indigo-600">{user.firstName}</span>
                  </div>
                  <button className="btn btn-ghost btn-circle" onClick={() => setMenuOpen(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                  <Link to="/profile" className="block px-4 py-2 rounded-lg hover:bg-indigo-50 font-medium" onClick={() => setMenuOpen(false)}>Profile</Link>
                  <Link to="/connections" className="block px-4 py-2 rounded-lg hover:bg-indigo-50 font-medium" onClick={() => setMenuOpen(false)}>Connections</Link>
                  <Link to="/requests" className="block px-4 py-2 rounded-lg hover:bg-indigo-50 font-medium" onClick={() => setMenuOpen(false)}>Requests</Link>
                  <Link to="/premium" className="block px-4 py-2 rounded-lg hover:bg-indigo-50 font-medium" onClick={() => setMenuOpen(false)}>Premium</Link>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 rounded-lg hover:bg-red-50 text-red-600 font-medium mt-4">Logout</button>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;