import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';


const Connections = () => {
    const connections = useSelector((store) => store.connections);
    const dispatch = useDispatch();
    const fetchConnections = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/connections", {
                withCredentials: true,
            });
            dispatch(addConnections(res.data.data));
        } catch (err) {
            // Handle Error Case
            console.error(err);
        }
    };

    useEffect(() => {
        fetchConnections();
    }, []);

    if (!connections) return;

    if (connections.length === 0) return <h1> No Connections Found</h1>;

    return (
    
        <div className="text-center my-10">
        <h1 className="text-bold text-white text-3xl">Connections</h1>
  
        {connections.map((connection) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            connection;
  
          return (<div
            key={_id}
            className="flex flex-col md:flex-row items-center gap-4 p-6 rounded-2xl shadow-lg bg-white border border-gray-200 w-full max-w-3xl mx-auto"
          >
            <div className="flex-shrink-0">
              <img
                alt="photo"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-400 shadow-md"
                src={photoUrl}
              />
            </div>
          
            <div className="text-center md:text-left flex-grow">
              <h2 className="font-bold text-2xl text-gray-800">{firstName + " " + lastName}</h2>
              {age && gender && (
                <p className="text-sm text-gray-600 mt-1">{age + ", " + gender}</p>
              )}
              <p className="text-gray-500 mt-2">{about}</p>
            </div>
          
            <Link to={"/chat/" + _id}>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all">
                Chat
              </button>
            </Link>
          </div>
          );
        })}
      </div>
    );
};
export default Connections;