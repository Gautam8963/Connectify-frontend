// utils/constants.js
export const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3001" // local backend
    : "https://connectify-backend-1-c1hv.onrender.com"; // render backend