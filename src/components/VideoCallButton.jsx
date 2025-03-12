import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const VideoCallButton = () => {
  const { targetUserId } = useParams();
  const navigate = useNavigate();

  const startVideoCall = () => {
    navigate(`/video-call/${targetUserId}`);
  };

  return (
    <button 
      onClick={startVideoCall} 
      className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
      title="Start video call"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="flex-shrink-0"
      >
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    </button>
  );
};

export default VideoCallButton;