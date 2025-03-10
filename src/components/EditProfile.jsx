import { useState } from "react";
import UserCard from "./UserCard";
import UserCardLook from "./userCardLook"
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
    const [age, setAge] = useState(user.age || "");
    const [gender, setGender] = useState(user.gender || "");
    const [about, setAbout] = useState(user.about || "");
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const [showToast, setShowToast] = useState(false);

    const saveProfile = async () => {
        //Clear Errors
        setError("");
        try {
            const res = await axios.patch(
                BASE_URL + "/profile/edit",
                {
                    firstName,
                    lastName,
                    photoUrl,
                    age,
                    gender,
                    about,
                },
                { withCredentials: true }
            );
            dispatch(addUser(res?.data?.data));
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        } catch (err) {
            setError(err.response.data);
        }
    };

    return (
        <>
            <div className="flex flex-col lg:flex-row justify-center items-center my-10 gap-6">
                <div className="flex justify-center mx-4 w-full max-w-lg">
                    <div className="card bg-white w-full shadow-xl border border-gray-200 rounded-2xl">
                        <div className="card-body">
                            <h2 className="card-title justify-center text-2xl font-bold text-gray-800">Edit Profile</h2>
                            <div>
                                {[{
                                    label: "First Name:", value: firstName, onChange: setFirstName
                                }, {
                                    label: "Last Name:", value: lastName, onChange: setLastName
                                }, {
                                    label: "Photo URL:", value: photoUrl, onChange: setPhotoUrl
                                }, {
                                    label: "Age:", value: age, onChange: setAge
                                }].map(({ label, value, onChange }) => (
                                    <label className="form-control w-full my-2" key={label}>
                                        <div className="label">
                                            <span className="label-text">{label}</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={value}
                                            className="input input-bordered w-full"
                                            onChange={(e) => onChange(e.target.value)}
                                        />
                                    </label>
                                ))}

                                <label className="form-control w-full my-2">
                                    <div className="label">
                                        <span className="label-text">Gender:</span>
                                    </div>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="select select-bordered w-full"
                                    >
                                        <option value="" disabled>Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Others</option>
                                    </select>
                                </label>

                                <label className="form-control w-full my-2">
                                    <div className="label">
                                        <span className="label-text">About:</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={about}
                                        className="input input-bordered w-full"
                                        onChange={(e) => setAbout(e.target.value)}
                                    />
                                </label>
                            </div>
                            <p className="text-red-500">{error}</p>
                            <div className="card-actions justify-center mt-4">
                                <button className="btn btn-primary w-full" onClick={saveProfile}>
                                    Save Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <UserCardLook
                    user={{ firstName, lastName, photoUrl, age, gender, about }}
                ></UserCardLook>
            </div>

            {showToast && (
                <div className="toast toast-top toast-center">
                    <div className="alert alert-success">
                        <span>Profile saved successfully.</span>
                    </div>
                </div>
            )}
        </>
    );
};
export default EditProfile;