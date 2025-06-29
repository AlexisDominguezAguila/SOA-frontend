// src/services/api.js
import axios from "axios";
import { logoutSilent } from "../utils/auth-helpers";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});


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
