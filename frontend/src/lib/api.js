import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://skillverse-m7g1.onrender.com/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("skillverse_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses globally (expired/invalid tokens)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes("/auth/login")) {
      // Token expired or invalid — clear session
      localStorage.removeItem("skillverse_token");
    }
    return Promise.reject(error);
  }
);
