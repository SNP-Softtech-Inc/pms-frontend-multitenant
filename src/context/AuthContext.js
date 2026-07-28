// import React, {
//   createContext,
//   useState,
//   useEffect,
//   useContext,
//   useCallback,
//   useRef,
// } from "react";
// import { useNavigate } from "react-router-dom";
// import { authAPI } from "../services/api";
// import {useToastContext} from "./ToastContext"
// import Cookies from "js-cookie";

// // ================= CREATE CONTEXT =================
// const AuthContext = createContext(null);

// // ================= CUSTOM HOOK =================
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// // ================= PROVIDER =================
// export const AuthProvider = ({ children }) => {
//   const navigate = useNavigate();
//   // const navigationRef = useRef(navigate);
//   // const logoutTimerRef = useRef(null);
// const {showToast}= useToastContext()
//   // useEffect(() => {
//   //   navigationRef.current = navigate;
//   // }, [navigate]);

//   // ================= STATE =================
//   const [user, setUser] = useState(null);
//   // const [token, setToken] = useState(null);
//   const [tenantId, setTenantId] = useState(null);
//   const [roleData, setRoleData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   // const [sessionExpiry, setSessionExpiry] = useState(null);

//   // const isAuthenticated = !!token;
// const isAuthenticated = !!user;
// const clearAuthData = useCallback(() => {
//   localStorage.removeItem("user");
//   localStorage.removeItem("tenantId");
//   localStorage.removeItem("roleData");

//   setUser(null);
//   setTenantId(null);
//   setRoleData(null);

// }, []);
// //   useEffect(() => {
// //   const initializeAuth = async () => {
// //     try {
// //       const response = await authAPI.getCurrentUser();

// //       const { user, roleData } = response.data;

// //       localStorage.setItem("user", JSON.stringify(user));
// //       localStorage.setItem("tenantId", user.tenantId);

// //       if (roleData) {
// //         localStorage.setItem("roleData", JSON.stringify(roleData));
// //       }

// //       setUser(user);
// //       setTenantId(user.tenantId);
// //       setRoleData(roleData);
// //     } catch (err) {
// //       clearAuthData();
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   initializeAuth();
// // }, [clearAuthData]);
  
// // useEffect(() => {
// //   try {
// //     const storedUser = localStorage.getItem("user");
// //     const storedTenantId = localStorage.getItem("tenantId");
// //     const storedRoleData = localStorage.getItem("roleData");

// //     if (storedUser) {
// //       setUser(JSON.parse(storedUser));
// //       setTenantId(storedTenantId);
// //       setRoleData(
// //         storedRoleData ? JSON.parse(storedRoleData) : null
// //       );
// //     }
// //   } catch (error) {
// //     console.error("Error initializing auth:", error);
// //     clearAuthData();
// //   } finally {
// //     setLoading(false);
// //   }
// // }, [clearAuthData]);


  
//   // ================= LOGIN =================
//   // const login = async (email, password, expiryTime) => {
//    const login = async (
//   email,
//   password,
//   expiryTime,
//   userId = null
// ) => {
//     setLoading(true);
//     try {
//       // const response = await authAPI.login(email, password, expiryTime);
// const response = await authAPI.login({
//   email,
//   password,
//   expiryTime,
//   userId,
// });
// console.log("login details of logged user",response.data);
//       // const { token, user, roleData } = response.data;
// const { user, roleData } = response.data;
//       // const expiryTimestamp = calculateExpiry(expiryTime);

//       // Store
//       // sessionStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));
//       localStorage.setItem("tenantId", user.tenantId);
//       // sessionStorage.setItem("sessionExpiry", expiryTimestamp.toString());

//       if (roleData) {
//         localStorage.setItem("roleData", JSON.stringify(roleData));
//       }

//       // Cookies.set("userToken", token, { expires: 7 });

//       // State
//       // setToken(token);
//       setUser(user);
//       setTenantId(user.tenantId);
//       setRoleData(roleData);
//       // setSessionExpiry(expiryTimestamp);

//       // setupAutoLogout(expiryTimestamp);

//       return { success: true, user };
//     } catch (error) {
//       if (error.response?.data?.multipleAccounts) {
//   return {
//     success: false,
//     multipleAccounts: true,
//     users: error.response.data.users,
//   };
// }
//       console.error("Login error:", error);

//       return {
//         success: false,
//         error:
//           error.response?.data?.message || "Login failed",
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   ;
// const logout = useCallback(async (logoutAll = false) => {
//   setLoading(true);

//   try {
//     if (logoutAll && authAPI.logoutAllDevices) {
//       await authAPI.logoutAllDevices();
//     } else {
//       await authAPI.logout();
//     }

//     showToast({
//       title: "Logged out successfully",
//       type: "success",
//     });
//   } catch (err) {
//     console.warn("Logout API failed:", err);

//     showToast({
//       title: "Session cleared locally",
//       type: "info",
//     });
//   } finally {
//     clearAuthData();
//     setLoading(false);
//     navigate("/admin/login", { replace: true });
//   }
// }, [clearAuthData, navigate, showToast]);
//   // ================= ROLE HELPERS =================
//   const hasRole = useCallback(
//     (roles) => {
//       if (!user) return false;
//       return Array.isArray(roles)
//         ? roles.includes(user.role)
//         : user.role === roles;
//     },
//     [user]
//   );

//   const isAdmin = useCallback(() => user?.role === "admin", [user]);
//   const isTeamMember = useCallback(
//     () => user?.role === "team_member",
//     [user]
//   );

//   const getPermissions = useCallback(() => {
//     return roleData?.permissions || {};
//   }, [roleData]);

//   // ================= UPDATE USER =================
//   const updateUserData = useCallback(
//     (updatedData) => {
//       const updatedUser = { ...user, ...updatedData };
//       localStorage.setItem("user", JSON.stringify(updatedUser));
//       setUser(updatedUser);
//     },
//     [user]
//   );

//   // ================= CONTEXT VALUE =================
//   const value = {
//     user,
//     // token,
//     tenantId,
//     roleData,
//     loading,
//     isAuthenticated,
//     login,
//     logout,
//     hasRole,
//     isAdmin,
//     isTeamMember,
//     getPermissions,
//     updateUserData,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;


import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRef } from "react";
import { authAPI} from "../services/api";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "./ToastContext";


const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
const navigate = useNavigate();
const { showToast } = useToastContext();
const sessionExpiredRef = useRef(false);
  const [roleData, setRoleData] = useState(null);

  const [accessToken, setAccessToken] = useState(null);

  const [loading, setLoading] = useState(true);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);
const manualLogoutRef = useRef(false);
  //------------------------------------------
  // LOGIN
  //------------------------------------------

  const login = async (email,
  password,
  expiryTime,
  userId,) => {
    // const response = await authAPI.post(
    //   "/auth/login",
    //   loginData
    // );
    console.log("login details payload",email,
  password,
  expiryTime,
  userId)
const response = await authAPI.login({
  email,
  password,
  expiryTime,
  userId,
});
    setAccessToken(response.data.accessToken);

    setUser(response.data.user);

    setRoleData(response.data.roleData);

    setIsAuthenticated(true);

    return response.data;
  };

  //------------------------------------------
  // LOGOUT
  //------------------------------------------

  // const logout = async () => {
  //   try {
  //     await authAPI.logout();
  //   } catch (err) {}

  //   setAccessToken(null);

  //   setUser(null);

  //   setRoleData(null);

  //   setIsAuthenticated(false);
  // };
// const logout = async () => {
//   try {
//     await authAPI.logout();
//   } catch (err) {
//     console.error(err);
//   }

//   setAccessToken(null);
//   setUser(null);
//   setRoleData(null);
//   setIsAuthenticated(false);

//   showToast({
//     title: "Logged Out",
//     description: "You have been logged out successfully.",
//     type: "success",
//   });

//   navigate("/login");
// };
const RECENT_SEARCHES_KEY = "recent_searches";

const logout = async () => {
  manualLogoutRef.current = true;

  try {
    await authAPI.logout();
  } catch (err) {
    console.error(err);
  }
localStorage.removeItem(RECENT_SEARCHES_KEY);  setAccessToken(null);
  setUser(null);
  setRoleData(null);
  setIsAuthenticated(false);

  showToast({
    title: "Logged Out",
    description: "You have been logged out successfully.",
    type: "success",
  });

  navigate("/login", { replace: true });
};
  //------------------------------------------
  // REFRESH ACCESS TOKEN
  //------------------------------------------

//   const refreshToken = useCallback(async () => {
//     try {
//       // const response = await api.get(
//       //   "/auth/refresh"
//       // );
// const response = await authAPI.refresh();
//       const token = response.data.accessToken;

//       setAccessToken(token);

//       return token;
//     } catch (err) {
//       setAccessToken(null);

//       setUser(null);

//       setRoleData(null);

//       setIsAuthenticated(false);

//       return null;
//     }
//   }, []);
const refreshToken = useCallback(async () => {
  try {
    const response = await authAPI.refresh();

    setAccessToken(response.data.accessToken);

    // Reset after successful refresh
    sessionExpiredRef.current = false;

    return response.data.accessToken;
  } 
  catch (err) {

  if (manualLogoutRef.current) {
    return null;
  }

  if (sessionExpiredRef.current) {
    return null;
  }

  sessionExpiredRef.current = true;

  setAccessToken(null);
  setUser(null);
  setRoleData(null);
  setIsAuthenticated(false);

  // showToast({
  //   title: "Session Expired",
  //   description: "Your session has expired. Please login again.",
  //   type: "warning",
  // });

  // navigate("/login", { replace: true });

  return null;
}
  // catch (err) {
  //   // Already handled once
  //   if (sessionExpiredRef.current) {
  //     return null;
  //   }

  //   sessionExpiredRef.current = true;

  //   setAccessToken(null);
  //   setUser(null);
  //   setRoleData(null);
  //   setIsAuthenticated(false);

  //   showToast({
  //     title: "Session Expired",
  //     description: "Your session has expired. Please login again.",
  //     type: "warning",
  //   });

  //   navigate("/login", { replace: true });

  //   return null;
  // }
}, [navigate, showToast]);
// const refreshToken = useCallback(async () => {
//   try {
//     const response = await authAPI.refresh();

//     setAccessToken(response.data.accessToken);

//     return response.data.accessToken;
//   } catch (err) {
//     setAccessToken(null);
//     setUser(null);
//     setRoleData(null);
//     setIsAuthenticated(false);

//     showToast({
//       title: "Session Expired",
//       description: "Your session has expired. Please login again.",
//       type: "warning",
//     });

//     navigate("/login");

//     return null;
//   }
// }, [navigate, showToast]);
  //------------------------------------------
  // LOAD USER
  //------------------------------------------

  const loadUser = useCallback(async () => {
    try {
      let token = accessToken;

      // if (!token) {
      //   token = await refreshToken();
      // }
      if (!accessToken && !isAuthenticated) {
  token = await refreshToken();
}

      if (!token) {
        setLoading(false);

        return;
      }

      // const response = await api.get("/auth/me", {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      const response = await authAPI.getCurrentUser()

      setUser(response.data.user);
      console.log("loggeduser details in context",response.data)

      setIsAuthenticated(true);
    } catch (err) {
      setUser(null);

      setRoleData(null);

      setAccessToken(null);

      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [accessToken, refreshToken]);

  //------------------------------------------
  // APP START
  //------------------------------------------

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  //------------------------------------------
  // CONTEXT VALUE
  //------------------------------------------

  const value = {
    user,

    roleData,

    accessToken,

    loading,

    isAuthenticated,

    login,

    logout,

    refreshToken,

    setAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};