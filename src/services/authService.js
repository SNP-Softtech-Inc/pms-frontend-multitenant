// import axios from "axios";

// // 🔹 Base API
// const API = axios.create({
//   baseURL: "http://127.0.0.1:8080/api/auth",
//   withCredentials: true, // optional (if using cookies)
// });

// // 🔹 REQUEST INTERCEPTOR (attach token)
// API.interceptors.request.use(
//   (req) => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       req.headers.Authorization = `Bearer ${token}`;
//     }

//     return req;
//   },
//   (error) => Promise.reject(error)
// );

// // 🔹 RESPONSE INTERCEPTOR (handle errors globally)
// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       console.error("API Error:", error.response.data.message);
//     } else {
//       console.error("Server not responding");
//     }
//     return Promise.reject(error);
//   }
// );

// //
// // ================= AUTH APIs =================
// //



// // SEND OTP
// export const sendOtp = (data) => API.post("/send-otp", data);

// // VERIFY OTP
// export const verifyOtp = (data) => API.post("/verify-otp", data);

// // RESEND OTP
// export const resendOtp = (data) => API.post("/resend-otp", data);

// // REGISTER FINAL
// export const registerUser = (data) => API.post("/register", data);

// // ✅ Login
// export const loginUser = async (data) => {
//   const res = await API.post("/login", data);

//   if (res.data.token) {
//     localStorage.setItem("token", res.data.token);
//   }

//   return res.data;
// };

// // ✅ Forgot Password (send OTP)
// export const forgotPassword = async (email) => {
//   const res = await API.post("/forgot-password", { email });
//   return res.data;
// };

// // ✅ Reset Password
// export const resetPassword = async ({ email, otp, newPassword }) => {
//   const res = await API.post("/reset-password", {
//     email,
//     otp,
//     newPassword,
//   });

//   return res.data;
// };

// // ✅ Logout (optional)
// export const logoutUser = () => {
//   localStorage.removeItem("token");
// };


import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8080/api/auth",
  withCredentials: true,
});

// REQUEST INTERCEPTOR
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error(err?.response?.data?.message || "Server error");
    return Promise.reject(err);
  }
);

// ✅ SERVICE OBJECT
const authService = {
  sendOtp: (data) => API.post("/send-otp", data),

  verifyOtp: (data) => API.post("/verify-otp", data),

  resendOtp: (data) => API.post("/resend-otp", data),

  registerUser: (data) => API.post("/register", data),

  loginUser: async (data) => {
    const res = await API.post("/login", data);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  },

  forgotPassword: async (email) => {
    const res = await API.post("/forgot-password", { email });
    return res.data;
  },

  resetPassword: async ({ email, otp, newPassword }) => {
    const res = await API.post("/reset-password", {
      email,
      otp,
      newPassword,
    });
    return res.data;
  },

  logoutUser: () => {
    localStorage.removeItem("token");
  },
};

export default authService;