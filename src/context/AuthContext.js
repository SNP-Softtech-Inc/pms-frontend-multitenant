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
import { useNavigate,useLocation } from "react-router-dom";
import { useToastContext } from "./ToastContext";
import { clearAccessToken,
  setAccessToken as saveAccessToken,
} from "../services/tokenService";
import axios from "axios";
import { parseSession } from "../lib/sessionTime";
import SessionExpiryWarning from "../components/SessionExpiryWarning";
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
const navigate = useNavigate();
const location = useLocation();
const AUTH_USER_URL = process.env.REACT_APP_AUTH_USER;
const { showToast } = useToastContext();
const sessionExpiredRef = useRef(false);
  const [roleData, setRoleData] = useState(null);

  const [accessToken, setAccessToken] = useState(null);

  const [loading, setLoading] = useState(true);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);
const manualLogoutRef = useRef(false);

  // When this sign-in ends: { expiresAt, durationMs } (v1.84.0). The refresh
  // cookie that really ends it is httpOnly, so signup-login v1.35.0 sends this
  // on login, refresh and renew. Re-read on every page load (loadUser calls
  // refresh), so it survives navigation and reloads.
  const [session, setSession] = useState(null);
  //------------------------------------------
  // LOGIN
  //------------------------------------------


const login = async (email, password, expiryTime, userId) => {
  const response = await authAPI.login({
    email,
    password,
    expiryTime,
    userId,
  });

  const { accessToken, user, roleData } = response.data;

saveAccessToken(accessToken);
setAccessToken(accessToken);
  setSession(parseSession(response.data.session));
  // Save user
  setUser(user);
console.log("logged user in context",user)


  setRoleData(roleData || null);

  setIsAuthenticated(true);

  sessionExpiredRef.current = false;
  manualLogoutRef.current = false;

  return response.data;
};
  
const RECENT_SEARCHES_KEY = "recent_searches";

const logout = async () => {
  manualLogoutRef.current = true;

  try {
    await authAPI.logout();
  } catch (err) {
    console.error(err);
  }

  setAccessToken(null);
  setUser(null);
  setRoleData(null);
  setIsAuthenticated(false);
  setSession(null);

  localStorage.removeItem(RECENT_SEARCHES_KEY);

  showToast({
    title: "Logged Out",
    description: "You have been logged out successfully.",
    type: "success",
  });

  navigate("/login", {
    replace: true,
  });
};
const refreshToken = useCallback(async () => {
  try {
    const { data } = await axios.post(
      `${AUTH_USER_URL}/api/auth/refresh-token`,
      {},
      {
        withCredentials: true,
      }
    );

    const token = data.accessToken;

    if (!token) return null;

    saveAccessToken(token);
    setAccessToken(token);
    // Same end as at sign-in - or a later one if another tab renewed it.
    if (data.session) setSession(parseSession(data.session));

    sessionExpiredRef.current = false;

    return token;
  } catch (err) {
    if (manualLogoutRef.current) return null;

    const status = err?.response?.status;
    const isRefreshTokenInvalid = status === 401 || status === 403;

    if (!isRefreshTokenInvalid) {
      // Transient failure (network blip, timeout, 5xx) - the refresh cookie
      // may still be valid, so don't kill the session; let the next
      // periodic refresh retry instead.
      return null;
    }

    if (sessionExpiredRef.current) return null;

    sessionExpiredRef.current = true;

    // clearAccessToken();

    setAccessToken(null);
    setUser(null);
    setRoleData(null);
    setIsAuthenticated(false);
    setSession(null);

    // showToast({
    //   title: "Session Expired",
    //   description: "Please login again.",
    //   type: "warning",
    // });

    // navigate("/login", {
    //   replace: true,
    // });

    return null;

     
  }
}, [navigate, showToast]);


const loadUser = useCallback(async () => {
  try {
    let token = accessToken;
    // Never log the token: anyone looking at the console - or a screenshot of
    // it - had a login good for up to 8 hours (removed v1.91.0).
    // First page load
    if (!token) {
      token = await refreshToken();
    }

    if (!token) {
      setLoading(false);
      return;
    }

    const response = await authAPI.getCurrentUser();

    setUser(response.data.user);

    // setRoleData(response.data.user.roleData || null);

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
useEffect(() => {
  if (!isAuthenticated) return;

  const interval = setInterval(async () => {
    const token = await refreshToken();

    // Only stop retrying once refreshToken() has confirmed the session is
    // actually over (invalid/expired refresh token) - a transient failure
    // returns null too but should not stop future retries.
    if (!token && sessionExpiredRef.current) {
      clearInterval(interval);
    }
  }, 5 * 60 * 1000); // check every minute

  return () => clearInterval(interval);
}, [isAuthenticated, refreshToken]);

// useEffect(() => {
//   if (!isAuthenticated) return;

//   const interval = setInterval(async () => {
//     await refreshToken();
//   }, 14 * 60 * 1000); // Refresh every 14 minutes

//   return () => clearInterval(interval);
// }, [isAuthenticated]);
  //------------------------------------------
  // SESSION: RENEW AND EXPIRY (v1.84.0)
  //------------------------------------------

  // "Renew session" in the expiry warning. Only a session that is still valid
  // can be renewed; a refusal is thrown to the caller, which says why.
  const renewSession = useCallback(async () => {
    const { data } = await axios.post(
      `${AUTH_USER_URL}/api/auth/renew-session`,
      {},
      { withCredentials: true }
    );

    if (data.accessToken) {
      saveAccessToken(data.accessToken);
      setAccessToken(data.accessToken);
    }
    setSession(parseSession(data.session));
    sessionExpiredRef.current = false;

    return data;
  }, [AUTH_USER_URL]);

  // At the end of the session: check once with the server (another tab may
  // have renewed it - the refresh then brings the later end and this re-arms),
  // otherwise sign out and say so rather than failing on the next click.
  useEffect(() => {
    if (!isAuthenticated || !session) return undefined;

    const delay = Math.max(1000, session.expiresAt - Date.now());

    const timer = setTimeout(async () => {
      const token = await refreshToken();
      if (token) return;

      if (sessionExpiredRef.current && !manualLogoutRef.current) {
        showToast({
          title: "Session expired",
          description: "Your session has ended. Please sign in again.",
          type: "warning",
        });
        navigate("/login", { replace: true });
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [isAuthenticated, session, refreshToken, navigate, showToast]);

  //------------------------------------------
  // APP START
  //------------------------------------------

useEffect(() => {

 const publicRoutes = [
  "/login",
  "/signup",
  "/unauthorized",
  "/forgot-password",
  "/reset-password",
  "/activate-team-member",
];


  const isPublicRoute = publicRoutes.some((route) =>
    location.pathname.startsWith(route)
  );


  if (isPublicRoute) {
    setLoading(false);
    return;
  }


  loadUser();

}, [location.pathname, loadUser]);
  
const value = {
  user,
  roleData,
  accessToken,
  loading,
  isAuthenticated,
  login,
  logout,
  refreshToken,
  loadUser,
  setAccessToken,
  session,
  renewSession,
};
  return (
    <AuthContext.Provider value={value}>
      {children}
      <SessionExpiryWarning />
    </AuthContext.Provider>
  );
};
