import React from 'react';
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";
import { UserPlus, UserX, Check, X, Bell } from "lucide-react";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.error("Review Request Error:", err?.response?.data || err.message);
    }
  };

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error("Fetch Requests Error:", err?.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-base-100 to-base-200">
        <div className="loading loading-dots loading-lg text-primary"></div>
        <p className="mt-4 text-base-content/70 font-medium">Loading connection requests...</p>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-base-100 to-base-200 p-6">
        <div className="bg-base-100 rounded-xl shadow-lg p-8 max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell size={36} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-base-content mb-3">No Connection Requests</h1>
          <p className="text-base-content/70 mb-6">You don't have any pending connection requests at the moment.</p>
          <button className="btn btn-outline btn-primary gap-2 opacity-70 cursor-not-allowed">
            <Bell size={18} />
            All Caught Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-center mb-8">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
            <UserPlus size={20} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-base-content">Connection Requests</h1>
        </div>
        
        <p className="text-center text-base-content/70 mb-10 max-w-xl mx-auto">
          You have {requests.length} pending connection request{requests.length !== 1 ? 's' : ''}. 
          Review each profile and decide if you'd like to connect!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => {
            const { _id, firstName, lastName, photoUrl, age, gender, about } = request.fromUserId;
            
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
                        <img src={photoUrl || "http://localhost:1111/avatar?seed=" + firstName} alt={`${firstName} ${lastName}`} />
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
                      {about || "A developer interested in connecting with you."}
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-base-200 flex gap-3">
                    <button
                      className="btn btn-outline btn-error btn-sm flex-1 gap-2"
                      onClick={() => reviewRequest("rejected", request._id)}
                    >
                      <X size={16} />
                      Decline
                    </button>
                    <button
                      className="btn btn-primary btn-sm flex-1 gap-2"
                      onClick={() => reviewRequest("accepted", request._id)}
                    >
                      <Check size={16} />
                      Accept
                    </button>
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

export default Requests;