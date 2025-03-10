import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";

const Requests = () => {
    const requests = useSelector((store) => store.requests);
    const dispatch = useDispatch();

    const reviewRequest = async (status, _id) => {
        try {
            const res = axios.post(
                BASE_URL + "/request/review/" + status + "/" + _id,
                {},
                { withCredentials: true }
            );
            dispatch(removeRequest(_id));
        } catch (err) { }
    };

    const fetchRequests = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/requests/received", {
                withCredentials: true,
            });

            dispatch(addRequests(res.data.data));
        } catch (err) { }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    if (!requests) return;

    if (requests.length === 0)
        return <h1 className="flex justify-center my-10"> No Requests Found</h1>;

    return (
        <div className="text-center my-10">
            <h1 className="text-bold text-white text-3xl">Connection Requests</h1>

            {requests.map((request) => {
                const { _id, firstName, lastName, photoUrl, age, gender, about } =
                    request.fromUserId;

                return (
                    <div
                        key={_id}
                        className="flex flex-col md:flex-row items-center md:justify-between gap-4 p-6 rounded-2xl shadow-lg bg-white border border-gray-200 mx-4 my-4 max-w-3xl mx-auto"
                    >
                        <div className="flex-shrink-0">
                            <img
                                alt="photo"
                                className="w-24 h-24 rounded-full border-4 border-blue-400 shadow-md"
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

                        <div className="flex gap-2 mt-4 md:mt-0">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                                onClick={() => reviewRequest("rejected", request._id)}
                            >
                                Reject
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
                                onClick={() => reviewRequest("accepted", request._id)}
                            >
                                Accept
                            </button>
                        </div>
                    </div>);
            })}
        </div>
    );
};
export default Requests;