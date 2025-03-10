import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      return navigate("/login");
    } catch (err) {
      // Error logic maybe redirect to error page
      console.log(err);
    }
  };

  return ( <div className="navbar bg-gradient-to-r from-pink-500 to-yellow-200 text-white shadow-md">
    <div className="flex-1">
      <Link to="/" className="btn btn-ghost text-xl font-bold">
        Connectify
      </Link>
    </div>
    {user && (
      <div className="flex-none gap-4 items-center">
        <div className="text-sm mr-2">Welcome, {user.firstName}</div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-circle avatar"
          >
            <div className="w-10 rounded-full border-2 border-white">
              <img alt="user photo" src={user.photoUrl} />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-white text-gray-800 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/profile" className="justify-between hover:bg-pink-100 rounded-md p-2">
                Profile
                <span className="badge badge-sm bg-pink-500 border-none text-white">New</span>
              </Link>
            </li>
            <li>
              <Link to="/connections" className="hover:bg-pink-100 rounded-md p-2">Connections</Link>
            </li>
            <li>
              <Link to="/requests" className="hover:bg-pink-100 rounded-md p-2">Requests</Link>
            </li>
            <li>
              <Link to="/premium" className="hover:bg-pink-100 rounded-md p-2">Premium</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="hover:bg-pink-100 rounded-md p-2 w-full text-left">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    )}
  </div>

  );
};
export default NavBar;