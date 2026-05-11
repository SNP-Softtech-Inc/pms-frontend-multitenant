import axios from "axios";

const api = axios.create({
  baseURL: "https://www.snptaxes.com",
});

const attachInterceptors = (api) => {
  // REQUEST INTERCEPTOR
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // RESPONSE INTERCEPTOR
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest?._retry) {
        originalRequest._retry = true;

        const message = error.response?.data?.message || "";

        if (
          message.includes("token") ||
          message.includes("expired") ||
          message.includes("unauthorized") ||
          message.includes("Not authorized")
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("usersdatatoken");
          localStorage.removeItem("user");
          localStorage.removeItem("roleData");
          localStorage.removeItem("rememberMe");

          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
        }
      }

      return Promise.reject(error);
    }
  );
};

attachInterceptors(api);

export default api;