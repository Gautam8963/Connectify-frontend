
import React from 'react';
import { FaVideo } from 'react-icons/fa';
import CallButton from './CallButton';
import VideoCall from './VideoCall';

const CallButton = ({ onClick, recipientId }) => {
  return (
    <button 
      className="w-9 h-9 rounded-full bg-blue-500 text-white flex justify-center items-center hover:bg-blue-600 transition-colors focus:outline-none"
      onClick={() => onClick(recipientId)}
      aria-label="Start video call"
    >
      <FaVideo className="text-white text-sm" />
    </button>
  );
};

export default CallButton;