import { useState } from "react";
import UserCardLook from "./userCardLook";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

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
    const [isLoading, setIsLoading] = useState(false);
    const [inputs, setInputs] = useState(user.skills?.length ? user.skills : ['']);
    // Add a new input field
    const addInput = () => {
        setInputs([...inputs, '']);
    };

    // Update the value of a specific input
    const handleInputChange = (index, value) => {
        const newInputs = [...inputs];
        newInputs[index] = value;
        setInputs(newInputs);
    };

    // Remove an input field
    const removeInput = (index) => {
        const newInputs = [...inputs];
        newInputs.splice(index, 1);
        setInputs(newInputs);
    };

    // console.log(user)
    const saveProfile = async () => {
        setError("");
        setIsLoading(true);
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
                    skills: inputs.filter(skill => skill.trim() !== '')
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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row justify-center items-start min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 py-10">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full lg:w-1/2 max-w-xl mx-auto lg:mx-4"
            >
                <div className="card w-full rounded-2xl shadow-xl bg-white overflow-hidden border border-indigo-100">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 h-2"></div>
                    </div>

                    <div className="card-body p-6 sm:p-8">
                        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Edit Your Profile
                        </h2>

                        <div className="space-y-4">
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text text-gray-600 font-medium">First Name</span>
                                </label>
                                <input
                                    type="text"
                                    value={firstName}
                                    placeholder="Your first name"
                                    className="input input-bordered w-full rounded-lg border-indigo-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 transition-all duration-200 text-gray-800"
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text text-gray-600 font-medium">Last Name</span>
                                </label>
                                <input
                                    type="text"
                                    value={lastName}
                                    placeholder="Your last name"
                                    className="input input-bordered w-full rounded-lg border-indigo-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 transition-all duration-200 text-gray-800"
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text text-gray-600 font-medium">Profile Photo URL</span>
                                </label>
                                <input
                                    type="url"
                                    value={photoUrl}
                                    placeholder= {BASE_URL + "/your-photo.jpg"}
                                    className="input input-bordered w-full rounded-lg border-indigo-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 transition-all duration-200 text-gray-800"
                                    onChange={(e) => setPhotoUrl(e.target.value)}
                                />
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text text-gray-600 font-medium">Age</span>
                                </label>
                                <input
                                    type="number"
                                    value={age}
                                    placeholder="Your age"
                                    className="input input-bordered w-full rounded-lg border-indigo-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 transition-all duration-200 text-gray-800"
                                    onChange={(e) => setAge(e.target.value)}
                                />
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text text-gray-600 font-medium">Gender</span>
                                </label>
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="select select-bordered w-full rounded-lg border-indigo-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 transition-all duration-200 text-gray-800"
                                >
                                    <option value="" disabled>Select your gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text text-gray-600 font-medium">SKILLS</span>
                                </label>

                                {inputs.map((input, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={input}
                                            placeholder={`Skill ${index + 1}`}
                                            className="input input-bordered w-full rounded-lg border-indigo-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 transition-all duration-200 text-gray-800"
                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                        />
                                        {inputs.length > 1 && (
                                            <button
                                                type="button"
                                                className="btn btn-outline btn-error"
                                                onClick={() => removeInput(index)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    className="btn btn-outline btn-primary mt-2"
                                    onClick={addInput}
                                >
                                    Add Skill
                                </button>
                            </div>


                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text text-gray-600 font-medium">About</span>
                                </label>
                                <textarea
                                    value={about}
                                    placeholder="Tell other developers about yourself, your interests and skills..."
                                    className="textarea textarea-bordered w-full h-24 rounded-lg border-indigo-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 transition-all duration-200 text-gray-800"
                                    onChange={(e) => setAbout(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="alert bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-6"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm">{error}</span>
                            </motion.div>
                        )}

                        <div className="card-actions mt-8">
                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.2)" }}
                                whileTap={{ scale: 0.98 }}
                                className="btn w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-none rounded-lg py-3 h-12 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                                onClick={saveProfile}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm mr-2"></span>
                                        Saving Profile...
                                    </>
                                ) : (
                                    'Save Profile'
                                )}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="w-full lg:w-1/2 max-w-xl mx-auto lg:mx-4 mt-8 lg:mt-0"
            >
                <div className="card w-full rounded-2xl shadow-xl bg-white overflow-hidden border border-indigo-100">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 h-2"></div>
                    </div>

                    <div className="card-body p-6 sm:p-8">
                        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Profile Preview
                        </h2>

                        <UserCardLook
                            user={{ firstName, lastName, photoUrl, age, gender, about, skills: inputs.filter(skill => skill.trim() !== '') }}
                        />
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="toast toast-top toast-center z-50"
                    >
                        <div className="alert shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white border-none p-4 rounded-lg">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span className="font-medium ml-2">Profile saved successfully!</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EditProfile;