import React from 'react';
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    if (feed && feed.length > 0) return;

    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      console.error("Feed Error:", err?.response?.data || err.message);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg text-[#FF4458]"></div>
          <p className="text-gray-500 text-sm">Finding your matches...</p>
        </div>
      </div>
    );
  }

  if (feed.length <= 0) {
    return (
      <div className="flex justify-center items-center px-4" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-700 mb-2">No More Profiles</h1>
          <p className="text-gray-500 mb-6">
            You've seen everyone in your area! Check back later for new developers.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 tinder-gradient text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Refresh Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-6" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <UserCard user={feed[0]} />
    </div>
  );
};
export default Feed;