import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatMessages = async () => {
    setLoading(true);
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      // Ensure we're not duplicating messages in the state
      const chatMessages = chat?.data?.messages.map((msg) => {
        const { senderId, text, createdAt } = msg;
        return {
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          text,
          timestamp: createdAt || new Date().toISOString(),
          // Track who sent the message to determine positioning
          isCurrentUser: senderId?._id === userId,
        };
      });
      setMessages(chatMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
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
    if (!userId) {
      return;
    }
    const socket = createSocketConnection();
    // As soon as the page loaded, the socket connection is made and joinChat event is emitted
    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text, senderId }) => {
      // Only add the message if we haven't already added it (prevents duplication)
      setMessages((prevMessages) => {
        // Check if this appears to be a duplicate of the most recent message
        const lastMsg = prevMessages[prevMessages.length - 1];
        if (
          lastMsg &&
          lastMsg.text === text &&
          lastMsg.firstName === firstName
        ) {
          return prevMessages;
        }

        return [
          ...prevMessages,
          {
            firstName,
            lastName,
            text,
            timestamp: new Date().toISOString(),
            isCurrentUser: senderId === userId,
          },
        ];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId, user]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });

    // Optimistically add message to UI
    setMessages((messages) => [
      ...messages,
      {
        firstName: user.firstName,
        lastName: user.lastName,
        text: newMessage,
        timestamp: new Date().toISOString(),
        isCurrentUser: true,
      },
    ]);

    setNewMessage("");
  };

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return "Just now";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Get the target user's name from messages or default to "Developer"
  const targetUserName = messages.find((msg) => !msg.isCurrentUser)
    ? `${
        messages.find((msg) => !msg.isCurrentUser).firstName
      } ${messages.find((msg) => !msg.isCurrentUser).lastName}`
    : "Developer";

  return (
    <div className="w-full min-h-screen flex flex-col bg-base-100 text-base-content"> {/* Updated background and text color to DaisyUI theme, min-h-screen */}
      {/* Header */}
      <div className="bg-base-200 border-b border-base-300 p-3 sm:p-4 flex items-center justify-between"> {/* Updated header background and border, padding */}
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-primary truncate max-w-[200px] sm:max-w-xs">Chat with {targetUserName}</h1> {/* Updated title style, truncate for responsiveness */}
          <div className="ml-2 sm:ml-4 flex items-center"> {/* Adjusted margin for responsiveness */}
            <div className="w-2 h-2 rounded-full bg-success mr-1 sm:mr-2"></div> {/* Updated online indicator color to success */}
            <span className="text-success text-sm">Online</span> {/* Updated online text color to success */}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-3 sm:p-6 bg-base-100"> {/* Updated message area padding */}
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="loading loading-dots loading-lg text-primary"></div> {/* DaisyUI loading indicator */}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-base-content text-opacity-60"> {/* Updated empty message text color */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 sm:h-16 sm:w-16 mb-3 sm:mb-4 text-primary opacity-70" // Updated icon size and color
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-center">No messages yet. Start the conversation!</p>
            <p className="text-center text-primary text-opacity-80 mt-1 sm:mt-2"> {/* Updated hint text style */}
              Connect with other developers now
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const isUser = msg.isCurrentUser;
              const showTimestamp =
                index === 0 ||
                formatTime(messages[index - 1].timestamp) !==
                  formatTime(msg.timestamp);

              return (
                <div key={index} className="mb-3 sm:mb-4"> {/* Adjusted message spacing */}
                  {showTimestamp && (
                    <div className="text-center text-xs sm:text-sm text-base-content text-opacity-70 my-1 sm:my-2"> {/* Updated timestamp style */}
                      {formatTime(msg.timestamp)}
                    </div>
                  )}
                  <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    {!isUser && (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary flex items-center justify-center mr-2 sm:mr-3 text-base-100 font-semibold"> {/* Updated avatar style */}
                        {msg.firstName.charAt(0)}
                      </div>
                    )}
                    <div className="flex flex-col max-w-[80%] sm:max-w-[70%]"> {/* Adjusted max width */}
                      {!isUser && (
                        <span className="text-xs sm:text-sm text-base-content text-opacity-70 ml-2 sm:ml-3 mb-0.5"> {/* Updated sender name style */}
                          {msg.firstName} {msg.lastName}
                        </span>
                      )}
                      <div
                        className={`rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-base-100 ${ // Adjusted message bubble padding and rounded corners
                          isUser
                            ? "bg-primary rounded-tr-none"
                            : "bg-base-200 rounded-tl-none" // Updated bubble background color
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div className={`text-xs sm:text-sm text-base-content text-opacity-70 mt-1 ${isUser ? "text-right mr-2 sm:mr-3" : "ml-2 sm:ml-3"}`}> {/* Updated message status style */}
                        {index === messages.length - 1 && isUser ? "Sent" : "Seen"}
                      </div>
                    </div>
                    {isUser && (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center ml-2 sm:ml-3 text-base-100 font-semibold"> {/* Updated avatar style */}
                        {msg.firstName.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input Area */}
      <div className="bg-base-200 border-t border-base-300 p-3 sm:p-4"> {/* Updated input area background and border, padding */}
        <div className="flex items-center bg-base-300 rounded-full pl-3 pr-1 sm:pl-4 sm:pr-2 py-1 sm:py-2"> {/* Updated input container style and padding */}
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="bg-transparent text-base-content flex-grow focus:outline-none text-sm sm:text-base" // Updated input text style
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-primary hover:bg-primary-focus disabled:bg-primary disabled:opacity-50 transition-colors ml-1 sm:ml-2" // Updated send button style and size
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 text-base-100 transform rotate-90" // Updated send icon size and color
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;