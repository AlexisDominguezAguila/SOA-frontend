import axios from "axios";
import { logoutSilent } from "../utils/auth-helpers";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api",
  withCredentials: false,
});

/*───  Inyectar token a cada request  ───*/
api.interceptors.request.use((config) => {
  const stored = JSON.parse(localStorage.getItem("userInfo") || "{}");
  if (stored.token) {
    config.headers.Authorization = `Bearer ${stored.token}`;
  }
  return config;
});

/*───  Manejo global 401  ───*/
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logoutSilent();
    }
    return Promise.reject(error);
  }
);

export default api;
