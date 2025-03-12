import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Send, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import VideoCallButton from "./VideoCallButton";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [targetUser, setTargetUser] = useState(null);
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const messagesEndRef = useState(null);
  // Video Calling feature
  const startVideoCall = () => {
    navigate(`/video-call/${targetUserId}`);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatMessages = async () => {
    setLoading(true);
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      const chatMessages = chat?.data?.messages.map((msg) => {
        const { senderId, text, createdAt } = msg;
        return {
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          text,
          timestamp: createdAt || new Date(),
          isCurrentUser: senderId?._id === userId
        };
      });

      setTargetUser(chat?.data?.targetUser || {
        firstName: 'User',
        lastName: ''
      });
      setMessages(chatMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, [targetUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();
    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text, photoUrl }) => {
      setMessages((messages) => [
        ...messages,
        {
          firstName,
          lastName,
          text,
          timestamp: new Date(),
          isCurrentUser: user.firstName === firstName,
          photoUrl
        }
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
      photoUrl: user.photoUrl
    });
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessageTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return "just now";
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden h-screen md:h-5/6 flex flex-col">
      {/* Chat Header */}
      <div className="bg-indigo-600 text-white p-4 flex items-center">
        <button
          onClick={() => window.history.back()}
          className="mr-3 p-1 rounded-full hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        {targetUser ? (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center text-white font-bold mr-3">
              {targetUser.firstName?.[0]}{targetUser.lastName?.[0]}
            </div>
            <div>
              <h2 className="font-bold text-lg">{`${targetUser.firstName} ${targetUser.lastName}`}</h2>
              <p className="text-xs text-indigo-200">
                {targetUser.isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        ) : (
          <h2 className="font-bold text-lg">Chat</h2>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-center">No messages yet</p>
            <p className="text-center text-sm">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${msg.isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              {!msg.isCurrentUser && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-bold mr-2">
                  {msg.firstName?.[0]}{msg.lastName?.[0]}
                </div>
              )}

              <div className={`max-w-xs md:max-w-md ${msg.isCurrentUser ? 'order-1' : 'order-2'}`}>
                <div
                  className={`px-4 py-2 rounded-lg ${msg.isCurrentUser
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                >
                  {msg.text}
                </div>
                <div className={`text-xs mt-1 ${msg.isCurrentUser ? 'text-right' : 'text-left'} text-gray-500`}>
                  {formatMessageTime(msg.timestamp)}
                </div>
              </div>
              {msg.isCurrentUser && (
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    alt={`${user.firstName}'s profile photo`}
                    src={user.photoUrl}
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none max-h-32"
            rows="1"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className={`p-3 rounded-full ${newMessage.trim()
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-gray-300 cursor-not-allowed'
              } transition-colors`}
          >
            <Send size={20} className="text-white" />
          </button>
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">
              {targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : 'Chat'}
            </h2>
            <VideoCallButton />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Chat;