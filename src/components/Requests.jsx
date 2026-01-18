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
      <div className="flex flex-col justify-center items-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="loading loading-spinner loading-lg text-[#FF4458]"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading connection requests...</p>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center px-4" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell size={36} className="text-[#FF4458]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">No Connection Requests</h1>
          <p className="text-gray-600 mb-6">You don't have any pending connection requests at the moment.</p>
          <button className="px-6 py-3 bg-gray-100 text-gray-400 rounded-full font-semibold cursor-not-allowed flex items-center gap-2 mx-auto">
            <Bell size={18} />
            All Caught Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-pink-50 min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 tinder-gradient rounded-full flex items-center justify-center mr-3">
            <UserPlus size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Connection Requests</h1>
        </div>

        <p className="text-center text-gray-600 mb-10 max-w-xl mx-auto">
          You have {requests.length} pending request{requests.length !== 1 ? 's' : ''}.
          Review each profile and decide if you'd like to connect!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => {
            const { _id, firstName, lastName, photoUrl, age, gender, about } = request.fromUserId;

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
                      {about || "A developer interested in connecting with you."}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
                    <button
                      className="flex-1 py-2.5 border-2 border-gray-300 text-gray-600 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
                      onClick={() => reviewRequest("rejected", request._id)}
                    >
                      <X size={18} />
                      Decline
                    </button>
                    <button
                      className="flex-1 py-2.5 tinder-gradient text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      onClick={() => reviewRequest("accepted", request._id)}
                    >
                      <Check size={18} />
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