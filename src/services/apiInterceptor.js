import axios from "axios";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "./tokenService";

let isRefreshing = false;

let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

export const attachInterceptor = (
  api,
  refreshApi,
  logoutCallback = null
) => {
  // ===============================
  // REQUEST
  // ===============================

  api.interceptors.request.use(
    (config) => {
      const token = getAccessToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // ===============================
  // RESPONSE
  // ===============================

  api.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status !== 401 ||
        originalRequest._retry
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // Already refreshing
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        }).then((token) => {
          originalRequest.headers.Authorization =
            `Bearer ${token}`;

          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const response = await refreshApi.get(
          "/api/auth/refresh"
        );

        const newToken = response.data.accessToken;

        setAccessToken(newToken);

        processQueue(null, newToken);

        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (err) {
        processQueue(err);

        clearAccessToken();

        if (logoutCallback) {
          logoutCallback();
        }

        window.location.href = "/admin/login";

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
  );
};