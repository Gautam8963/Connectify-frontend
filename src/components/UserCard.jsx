import React from 'react';
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { motion } from 'framer-motion';
import { X, Heart } from 'lucide-react';

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about, skills = [], matchScore } = user;
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

  // Generate default skills if not provided
  const defaultSkills = ["React", "Node.js", "JavaScript", "Python", "TypeScript"];
  const displaySkills = skills.length > 0 ? skills.slice(0, 4) : defaultSkills.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -100 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm mx-auto animate-card-appear"
    >
      {/* Main Card */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white">
        {/* Profile Image Container */}
        <div className="relative h-[500px] sm:h-[550px] w-full overflow-hidden">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={`${firstName}'s profile`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full tinder-gradient flex items-center justify-center">
              <span className="text-white text-7xl font-bold">
                {firstName?.charAt(0)}{lastName?.charAt(0)}
              </span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* User Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-end justify-between mb-3">
              <div>
                <h2 className="text-3xl font-bold mb-1">
                  {firstName} {lastName}
                  {age && <span className="text-2xl font-normal ml-2">{age}</span>}
                </h2>
                {gender && (
                  <p className="text-sm opacity-90 capitalize">
                    {gender} • Developer
                  </p>
                )}
              </div>

              {/* Match Score Badge */}
              {matchScore !== undefined && matchScore > 0 && (
                <div className="bg-[#FF4458] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  {matchScore}% Match
                </div>
              )}
            </div>

            {/* Skills Pills */}
            {displaySkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {displaySkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* About (if exists) */}
            {about && about !== "This is a default about of the user!" && (
              <p className="text-sm opacity-90 line-clamp-2 mt-2">
                {about}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-6 mt-6">
        {/* Pass Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gray-400"
          onClick={() => handleSendRequest("ignored", _id)}
        >
          <X className="w-8 h-8 text-gray-500" strokeWidth={2.5} />
        </motion.button>

        {/* Like Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-20 h-20 rounded-full tinder-gradient flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 animate-heart-beat"
          onClick={() => handleSendRequest("interested", _id)}
        >
          <Heart className="w-10 h-10 text-white fill-white" strokeWidth={0} />
        </motion.button>
      </div>

      {/* Swipe Hint Text */}
      <p className="text-center text-xs text-gray-400 mt-4">
        Swipe or tap to connect
      </p>
    </motion.div>
  );
};

export default UserCard;