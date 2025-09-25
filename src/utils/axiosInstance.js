// utils/axiosInstance.js
import axios from "axios";
import { BASE_URL } from "./constants";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ✅ always send cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: intercept errors globally
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("Axios error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default axiosInstance;