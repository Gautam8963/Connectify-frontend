import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Peer from "simple-peer";
import { createSocketConnection } from "../utils/socket";

const VideoCall = () => {
  const { targetUserId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef();
  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const [stream, setStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [calling, setCalling] = useState(false);

  useEffect(() => {
    window.global = window; // Define global

    // Connect to socket
    socketRef.current = createSocketConnection();

    // Get user media
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (userVideo.current) {
          userVideo.current.srcObject = currentStream;
        }
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
      });

    // Join video room
    const userId = localStorage.getItem("userId");
    const firstName = localStorage.getItem("firstName");

    if (userId && targetUserId) {
      socketRef.current.emit("joinVideoRoom", { 
        firstName, 
        userId, 
        targetUserId 
      });
    }

    // Socket event listeners
    socketRef.current.on("callUser", ({ signal }) => {
      setCalling(true);
    });

    socketRef.current.on("callAccepted", ({ signal }) => {
      setCallAccepted(true);
      peerRef.current.signal(signal);
    });

    socketRef.current.on("callEnded", () => {
      setCallEnded(true);
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      // Redirect to chat
      navigate(`/chat/${targetUserId}`);
    });

    return () => {
      // Cleanup
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [targetUserId, navigate]);

  const callUser = () => {
    try {
      const userId = localStorage.getItem("userId");
      const firstName = localStorage.getItem("firstName");
      const lastName = localStorage.getItem("lastName");

      // Create peer connection
      peerRef.current = new Peer({
        initiator: true,
        trickle: false,
        stream: stream
      });

      // When we have a signal, send it to the other user
      peerRef.current.on("signal", (signal) => {
        socketRef.current.emit("callUser", {
          userId,
          targetUserId,
          firstName,
          lastName,
          signal
        });
      });

      // When we receive a stream, add it to the partner video
      peerRef.current.on("stream", (currentStream) => {
        if (partnerVideo.current) {
          partnerVideo.current.srcObject = currentStream;
        }
      });

      socketRef.current.on("callAccepted", ({ signal }) => {
        setCallAccepted(true);
        peerRef.current.signal(signal);
      });
    } catch (error) {
      console.error("Error creating Peer:", error);
    }
  };

  const answerCall = () => {
    setCallAccepted(true);
    setCalling(false);

    const userId = localStorage.getItem("userId");
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");

    // Create peer connection
    peerRef.current = new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    });

    // When we have a signal, send it to the caller
    peerRef.current.on("signal", (signal) => {
      socketRef.current.emit("answerCall", {
        userId,
        targetUserId,
        firstName,
        lastName,
        signal
      });
    });

    // When we receive a stream, add it to the partner video
    peerRef.current.on("stream", (currentStream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = currentStream;
      }
    });

    // Signal the peer with the caller's signal
    socketRef.current.on("userSignal", ({ signal }) => {
      peerRef.current.signal(signal);
    });
  };

  const endCall = () => {
    setCallEnded(true);

    if (peerRef.current) {
      peerRef.current.destroy();
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    const userId = localStorage.getItem("userId");

    socketRef.current.emit("endCall", {
      userId,
      targetUserId
    });

    // Redirect to chat
    navigate(`/chat/${targetUserId}`);
  };

  return (
    <div className="flex flex-col h-full min-h-screen p-6 bg-gray-100 rounded-lg">
      <div className="flex flex-wrap justify-center gap-6 mb-6">
        <div className="relative w-96 h-72 overflow-hidden rounded-lg shadow-md bg-black">
          <video
            playsInline
            muted
            ref={userVideo}
            autoPlay
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            You
          </div>
        </div>

        {callAccepted && !callEnded && (
          <div className="relative w-96 h-72 overflow-hidden rounded-lg shadow-md bg-black">
            <video
              playsInline
              ref={partnerVideo}
              autoPlay
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              Partner
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        {!callAccepted && !calling && (
          <button 
            onClick={callUser} 
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors"
          >
            Start Call
          </button>
        )}
        
        {calling && !callAccepted && (
          <div className="flex flex-col items-center gap-3">
            <p className="text-lg font-medium">Incoming call...</p>
            <div className="flex gap-3">
              <button 
                onClick={answerCall} 
                className="px-6 py-3 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors"
              >
                Answer
              </button>
              <button 
                onClick={endCall} 
                className="px-6 py-3 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        )}
        
        {callAccepted && !callEnded && (
          <button 
            onClick={endCall} 
            className="px-6 py-3 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
          >
            End Call
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
