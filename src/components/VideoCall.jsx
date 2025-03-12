// src/components/VideoCall.jsx

import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { socket } from '../utils/socket';
import { FaPhoneSlash, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from 'react-icons/fa';

const VideoCall = ({ userId, currentCall, setCurrentCall, onEndCall }) => {
  const [stream, setStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    // Get media stream when component mounts
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((err) => {
        console.error("Error accessing media devices: ", err);
        alert("Failed to access camera and microphone. Please check permissions.");
      });

    // Set up socket listeners for incoming calls
    socket.on('call-incoming', ({ from, name, signal }) => {
      setCurrentCall({ isReceivingCall: true, from, name, signal });
    });

    socket.on('call-accepted', (signal) => {
      setCallAccepted(true);
      connectionRef.current.signal(signal);
    });

    socket.on('call-ended', () => {
      endCall();
    });

    // Cleanup on component unmount
    return () => {
      socket.off('call-incoming');
      socket.off('call-accepted');
      socket.off('call-ended');
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream
    });

    peer.on('signal', (data) => {
      socket.emit('call-user', {
        userToCall: id,
        signalData: data,
        from: userId,
        name: userId // You can replace with actual user name if available
      });
    });

    peer.on('stream', (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    socket.on('call-accepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream
    });

    peer.on('signal', (data) => {
      socket.emit('answer-call', { signal: data, to: currentCall.from });
    });

    peer.on('stream', (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    peer.signal(currentCall.signal);
    connectionRef.current = peer;
  };

  const endCall = () => {
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    
    setCallEnded(true);
    setCallAccepted(false);
    
    if (currentCall.from) {
      socket.emit('end-call', { to: currentCall.from });
    }
    
    // Reset stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    onEndCall();
  };

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = isVideoOff;
      setIsVideoOff(!isVideoOff);
    }
  };

  // Call answer UI 
  if (currentCall.isReceivingCall && !callAccepted) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full min-h-64 bg-gray-900 rounded-lg p-6 gap-5">
        <h3 className="text-white text-xl font-medium">{currentCall.name || "Someone"} is calling...</h3>
        <div className="flex gap-4">
          <button 
            className="px-6 py-2 rounded-full bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
            onClick={answerCall}
          >
            Answer
          </button>
          <button 
            className="px-6 py-2 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
            onClick={endCall}
          >
            Decline
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full min-h-64 bg-gray-900 rounded-lg overflow-hidden relative">
      <div className="flex flex-1 flex-wrap justify-center items-center gap-3 p-4">
        {stream && (
          <div className="absolute bottom-20 right-5 w-1/3 h-40 overflow-hidden rounded-lg border-2 border-gray-700 bg-black z-10">
            <video playsInline muted ref={myVideo} autoPlay className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
              You
            </div>
          </div>
        )}
        
        {callAccepted && !callEnded && (
          <div className="w-full h-full overflow-hidden rounded-lg bg-black">
            <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
              {currentCall.name || "Caller"}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center gap-4 p-4 bg-black bg-opacity-50">
        <button 
          className={`w-12 h-12 rounded-full flex justify-center items-center focus:outline-none ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'} transition-colors`} 
          onClick={toggleMute}
        >
          {isMuted ? <FaMicrophoneSlash className="text-white" /> : <FaMicrophone className="text-white" />}
        </button>
        
        <button 
          className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex justify-center items-center focus:outline-none transition-colors" 
          onClick={endCall}
        >
          <FaPhoneSlash className="text-white" />
        </button>
        
        <button 
          className={`w-12 h-12 rounded-full flex justify-center items-center focus:outline-none ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'} transition-colors`} 
          onClick={toggleVideo}
        >
          {isVideoOff ? <FaVideoSlash className="text-white" /> : <FaVideo className="text-white" />}
        </button>
      </div>
    </div>
  );
};

export default VideoCall;