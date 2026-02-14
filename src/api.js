import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

export function setAuthToken(token) {
  if (!token) {
    delete api.defaults.headers.common["Authorization"];
    return;
  }
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
