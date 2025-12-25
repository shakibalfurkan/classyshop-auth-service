import envConfig from "@/config/envConfig";
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

    if (!error.response) {
      return Promise.reject(error);
    }

    // Refresh token endpoint itself failed
    if (originalRequest.url?.includes("/auth/refresh-token")) {
      isRefreshing = false;
      processQueue(error);

      // TODO: logout user from frontend state and redirect to login
      // logout user logic here

      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Token expired, attempt refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request until token is refreshed
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            originalRequest._retry = true;
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

        // TODO: logout user from frontend state and redirect to login
        // logout user logic here

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
