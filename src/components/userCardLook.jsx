import React from 'react';
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { motion } from 'framer-motion';

const UserCardLook = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about, skills = [] } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error("Error in handleSendRequest:", err.response?.data || err.message);
    }
  };

  // Generate a random skill set if not provided
  const defaultSkills = ["React", "Node.js", "JavaScript", "Python", "TypeScript"];
  const displaySkills = skills.length > 0 ? user.skills : defaultSkills.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      className="w-full sm:w-96 overflow-hidden rounded-2xl shadow-lg bg-white border border-indigo-100"
    >
      <div className="relative">
        {/* Profile Image */}
        <div className="h-64 sm:h-80 w-full overflow-hidden">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={`${firstName}'s profile`}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-6xl font-bold">
                {firstName?.charAt(0)}{lastName?.charAt(0)}
              </span>
            </div>
          )}
          
          {/* Gradient overlay at bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent opacity-60"></div>
        </div>
        
        {/* User info banner */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold">{firstName} {lastName}</h2>
              {age && <p className="text-sm opacity-90">{age} years • {gender || 'Developer'}</p>}
            </div>
            <div className="bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded-full">
              98% Match
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Skills section */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">SKILLS</p>
          <div className="flex flex-wrap gap-2">
            {displaySkills.map((skill, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        {/* Recommendation */}
        <div className="bg-indigo-50 rounded-lg p-3 mb-4">
          <div className="flex items-center mb-2">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-indigo-300 flex items-center justify-center text-white text-xs">E</div>
              <div className="w-6 h-6 rounded-full bg-purple-300 flex items-center justify-center text-white text-xs">J</div>
              <div className="w-6 h-6 rounded-full bg-indigo-400 flex items-center justify-center text-white text-xs">M</div>
            </div>
            <p className="text-xs text-gray-600 ml-2">
              Emily and 3 others recommended this match
            </p>
          </div>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">{firstName}</span> might be your perfect coding partner!
          </p>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-between items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Skip
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
            onClick={() => handleSendRequest("interested", _id)}
          >
            Connect
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCardLook;