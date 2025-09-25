export const BASE_URL = "https://connectify-backend-1-c1hv.onrender.com";

const allowedOrigins = [
  "http://localhost:5173",
  "https://connectify-frontend-lime.vercel.app"
];

app.use(require("cors")({
  origin: allowedOrigins,
  credentials: true
}));