import React from 'react';
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";
import { MessageSquare, UserPlus, Users } from "lucide-react";

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
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-base-100 to-base-200">
        <div className="loading loading-dots loading-lg text-primary"></div>
        <p className="mt-4 text-base-content/70 font-medium">Loading your connections...</p>
      </div>
    );
  }

  if (!connections || connections.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-6">
        <div className="bg-base-100 rounded-xl shadow-lg p-8 max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={36} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-base-content mb-3">No Connections Yet</h1>
          <p className="text-base-content/70 mb-6">Start exploring and connect with developers who share your interests!</p>
          <Link to="/discover">
            <button className="btn btn-primary gap-2">
              <UserPlus size={18} />
              Find Developers
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-center mb-8">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
            <Users size={20} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-base-content">Your Connections</h1>
        </div>
        
        <p className="text-center text-base-content/70 mb-10 max-w-xl mx-auto">
          You've connected with {connections.length} developer{connections.length !== 1 ? 's' : ''}. 
          Chat and collaborate on exciting projects together!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((connection) => {
            const { _id, firstName, lastName, photoUrl, age, gender, about } = connection;
            
            return (
              <div
                key={_id}
                className="bg-base-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-base-200 group"
              >
                <div className="relative">
                  <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    <div className="avatar">
                      <div className="w-24 h-24 rounded-full ring ring-base-100 ring-offset-base-100 ring-offset-2">
                        <img src={photoUrl || BASE_URL + "/avatar?seed=" + firstName} alt={`${firstName} ${lastName}`} />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-16 pb-6 px-6 text-center">
                  <h2 className="text-xl font-bold text-base-content mb-1">{firstName} {lastName}</h2>
                  {age && gender && (
                    <p className="text-sm text-base-content/60 mb-3">{age} • {gender}</p>
                  )}
                  <div className="h-16 overflow-hidden">
                    <p className="text-base-content/80 text-sm line-clamp-3">
                      {about || "A passionate developer looking to collaborate on interesting projects."}
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-base-200">
                    <Link to={"/chat/" + _id}>
                      <button className="btn btn-primary btn-sm w-full gap-2 group-hover:scale-105 transition-transform duration-300">
                        <MessageSquare size={16} />
                        Start Chatting
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