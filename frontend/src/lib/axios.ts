import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setupInterceptors = (getAccessToken: () => string | null, refreshToken: () => Promise<void>) => {
  apiClient.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        try {
          await refreshToken();
          return apiClient(error.config);
        } catch {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );
};
