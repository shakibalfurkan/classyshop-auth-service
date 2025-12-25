import envConfig from "@/config/envConfig";
import { logout } from "@/services/AuthService";
import axios from "axios";

const axiosClient = axios.create({
  baseURL: envConfig.baseApi,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(true);
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log(error.response.data.message);

    if (!error.response) {
      return Promise.reject(error);
    }

    // Token expired, attempt refresh
    if (
      error.response.status === 401 &&
      error.response.data.message === "jwt expired" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // Queue this request until token is refreshed
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh the token
        await axios.post(
          `${envConfig.baseApi}/auth/api/v1/refresh-token`,
          {},
          { withCredentials: true }
        );

        // Process all queued requests
        processQueue(null);

        isRefreshing = false;

        // Retry original request
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;

        await logout();
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
