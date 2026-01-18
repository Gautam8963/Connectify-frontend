import React from 'react';
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";
import { MessageSquare, UserPlus, Users, Heart } from "lucide-react";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const fetchConnections = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error("Connection Fetch Error:", err?.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-white to-pink-50">
        <div className="loading loading-spinner loading-lg text-[#FF4458]"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading your connections...</p>
      </div>
    );
  }

  if (!connections || connections.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-white to-pink-50 p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={36} className="text-[#FF4458]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">No Matches Yet</h1>
          <p className="text-gray-600 mb-6">Start swiping to find developers who share your passion!</p>
          <Link to="/">
            <button className="px-6 py-3 tinder-gradient text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto">
              <UserPlus size={18} />
              Start Swiping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-pink-50 min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 tinder-gradient rounded-full flex items-center justify-center mr-3">
            <Heart size={24} className="text-white fill-white" strokeWidth={0} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Your Matches</h1>
        </div>

        <p className="text-center text-gray-600 mb-10 max-w-xl mx-auto">
          You've matched with {connections.length} developer{connections.length !== 1 ? 's' : ''}!
          Start chatting and build something amazing together.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((connection) => {
            const { _id, firstName, lastName, photoUrl, age, gender, about } = connection;

            return (
              <div
                key={_id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2"
              >
                <div className="relative">
                  <div className="h-32 tinder-gradient-soft"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    <div className="avatar">
                      <div className="w-24 h-24 rounded-full ring-4 ring-white">
                        {photoUrl ? (
                          <img src={photoUrl} alt={`${firstName} ${lastName}`} className="object-cover" />
                        ) : (
                          <div className="w-full h-full tinder-gradient flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">
                              {firstName?.charAt(0)}{lastName?.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-16 pb-6 px-6 text-center">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">{firstName} {lastName}</h2>
                  {age && gender && (
                    <p className="text-sm text-gray-500 mb-3 capitalize">{age} • {gender}</p>
                  )}
                  <div className="h-16 overflow-hidden">
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {about || "A passionate developer looking to collaborate on interesting projects."}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Link to={"/chat/" + _id}>
                      <button className="w-full py-3 tinder-gradient text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-105">
                        <MessageSquare size={18} />
                        Message
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Connections;