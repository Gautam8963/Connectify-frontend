import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
        
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
        console.error("Error in handleSendRequest:", err.response?.data || err.message);    }
  };

  return (<div className="card bg-gray-100 w-96 rounded-xl shadow-lg border"> {/* Added subtle gray background */}
    <div className="relative">
      <figure>
        <img src={user.photoUrl} alt="photo" className="rounded-t-xl w-full h-80 object-cover" />
      </figure>
      <div className="absolute top-4 left-4 bg-white bg-opacity-80 rounded-full p-2">
        <h2 className="text-xl font-semibold">{firstName}</h2>
        {age && <p className="text-sm">{age}</p>}
      </div>
    </div>
    <div className="card-body p-6">
      <p className="text-sm text-gray-600 mb-2">
        Your friend Emily and 3 others recommended<br />
        {firstName}'s profile for you!
      </p>
      <div className="flex justify-between items-center mt-4">
        <button
          className="btn btn-circle btn-outline btn-md text-red-500 border-2 border-red-500 hover:bg-red-100 hover:text-red-600" // Increased size and hover effect
          onClick={() => handleSendRequest("ignored", _id)}
        >
          X
        </button>
        <button
          className="btn btn-circle btn-warning btn-md hover:scale-105" // Increased size and hover scale
          onClick={() => handleSendRequest("interested", _id)}
        >
          ★
        </button>
      </div>
    </div>
  </div>
  );
};
export default UserCard;