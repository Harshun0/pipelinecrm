import axios from "axios";

// In local devs, requests go to the backend on port 5000 (CORS allows all localhost ports).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://pipelinecrm-backend.onrender.com',
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
