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
    if (feed && feed.length > 0) return; // Added check to prevent unnecessary API calls if feed is already populated

    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      console.error("Feed Error:", err?.response?.data || err.message); // Improved error logging
      // Optionally: Dispatch an action to handle feed error state in Redux
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) {
    return (
      <div className="flex justify-center items-center min-h-screen"> {/* Full screen centering */}
        <div className="loading loading-dots loading-lg text-primary"></div> {/* DaisyUI loading indicator */}
      </div>
    );
  }

  if (feed.length <= 0) {
    return (
      <div className="flex justify-center items-center min-h-screen"> {/* Full screen centering */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-base-content mb-4">No new developers found right now!</h1> {/* Styled message */}
          <p className="text-base-content text-opacity-80">Check back later for more connections.</p> {/* Subtler secondary message */}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-6 sm:p-8 mt-6 sm:mt-10"> {/* Added padding and top margin for better spacing */}
      <UserCard user={feed[0]} />
    </div>
  );
};
export default Feed;