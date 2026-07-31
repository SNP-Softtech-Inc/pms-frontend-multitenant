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
import { authAPI } from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { useToastContext } from "./ToastContext";
import {
  setAccessToken as saveAccessToken,
  getAccessToken,
  clearAccessToken,
} from "../services/tokenService";
import {
  EXPIRES_KEY,
  parseExpiryToMs,
  getHandoffIdFromUrl,
  stripHandoffParam,
  requestHandoffToken,
  startHandoffResponder,
  broadcastLogout,
} from "../utils/authHandoff";
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToastContext();
  const sessionExpiredRef = useRef(false);
  const [roleData, setRoleData] = useState(null);

  const [accessToken, setAccessToken] = useState(null);

  const [loading, setLoading] = useState(true);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const manualLogoutRef = useRef(false);
  const logoutTimerRef = useRef(null);

  //------------------------------------------
  // SESSION HELPERS (auto-logout / cleanup)
  //------------------------------------------

  const clearLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  // Clear all auth state (sessionStorage + React state). Does not navigate.
  const clearSession = useCallback(() => {
    clearLogoutTimer();
    clearAccessToken();
    setAccessToken(null);
    setUser(null);
    setRoleData(null);
    setIsAuthenticated(false);
  }, []);

  // Absolute session timeout fired (or session already found expired on load).
  const handleSessionExpired = useCallback(() => {
    manualLogoutRef.current = true;
    clearSession();
    showToast({
      title: "Session Expired",
      description: "Please login again.",
      type: "warning",
    });
    navigate("/login", { replace: true });
  }, [clearSession, navigate, showToast]);

  // (Re)arm the auto-logout timer for the given absolute expiry (epoch ms).
  const armLogoutTimer = useCallback(
    (expiresAt) => {
      clearLogoutTimer();
      if (!expiresAt) return;
      const remaining = expiresAt - Date.now();
      if (remaining <= 0) {
        handleSessionExpired();
        return;
      }
      logoutTimerRef.current = setTimeout(handleSessionExpired, remaining);
    },
    [handleSessionExpired],
  );

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

    if (accessToken) {
      const expiresAt = Date.now() + parseExpiryToMs(expiryTime);

      // Persist to sessionStorage (per-tab; survives reload, cleared on close).
      saveAccessToken(accessToken);
      sessionStorage.setItem(EXPIRES_KEY, String(expiresAt));

      setAccessToken(accessToken);
      setUser(user);
      setRoleData(roleData || null);
      setIsAuthenticated(true);

      armLogoutTimer(expiresAt);
    }

    sessionExpiredRef.current = false;
    manualLogoutRef.current = false;

    return response.data;
  };

  const logout = async () => {
    manualLogoutRef.current = true;

    try {
      await authAPI.logout();
    } catch (err) {
      console.error(err);
    }

    clearSession();

    localStorage.removeItem("recent_searches");

    // Sign out sibling tabs too.
    broadcastLogout();

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
      const { data } = await authAPI.refresh();
      const token = data.accessToken;

      if (!token) return null;

      setAccessToken(token);

      sessionExpiredRef.current = false;

      return token;
    } catch (err) {
      if (manualLogoutRef.current) return null;

      if (sessionExpiredRef.current) return null;

      sessionExpiredRef.current = true;

      // clearAccessToken();

      setAccessToken(null);
      setUser(null);
      setRoleData(null);
      setIsAuthenticated(false);

      showToast({
        title: "Session Expired",
        description: "Please login again.",
        type: "warning",
      });

      // navigate("/login", {
      //   replace: true,
      // });

      return null;
    }
  }, [showToast]);
  // const refreshToken = useCallback(async () => {
  //   try {
  //     const response = await authAPI.refresh();

  //     const token = response.data.accessToken;

  //     if (!token) return null;

  //     // setAccessToken(token);
  // saveAccessToken(token);      // IMPORTANT
  // setAccessToken(token);       // React state
  //     sessionExpiredRef.current = false;

  //     return token;
  //   } catch (err) {
  //     if (manualLogoutRef.current) return null;

  //     if (sessionExpiredRef.current) return null;

  //     sessionExpiredRef.current = true;

  //     setAccessToken(null);
  //     setUser(null);
  //     setRoleData(null);
  //     setIsAuthenticated(false);

  //     showToast({
  //       title: "Session Expired",
  //       description: "Please login again.",
  //       type: "warning",
  //     });

  //     navigate("/login", {
  //       replace: true,
  //     });

  //     return null;
  //   }
  // }, [navigate, showToast]);

  const loadUser = useCallback(async () => {
    try {
      let token = getAccessToken();
      let expiresAt = Number(sessionStorage.getItem(EXPIRES_KEY)) || null;

      // No token in this tab: this may be a tab opened from within the app
      // (right-click / new tab). Adopt a token from an already-open tab.
      if (!token) {
        const handoffId = getHandoffIdFromUrl();
        if (handoffId) {
          const result = await requestHandoffToken(handoffId);
          if (result && result.token) {
            token = result.token;
            expiresAt = result.expiresAt || null;
            saveAccessToken(token);
            if (expiresAt) {
              sessionStorage.setItem(EXPIRES_KEY, String(expiresAt));
            }
          }
        }
      }

      // Clean the handoff marker out of the address bar.
      if (getHandoffIdFromUrl()) stripHandoffParam();

      if (!token) {
        setLoading(false);
        return;
      }

      // Session already past its absolute expiry.
      if (expiresAt && expiresAt <= Date.now()) {
        clearSession();
        setLoading(false);
        return;
      }

      const response = await authAPI.getCurrentUser();

      setUser(response.data.user);
      setAccessToken(token);
      setIsAuthenticated(true);

      armLogoutTimer(expiresAt);
    } catch (err) {
      clearSession();
    } finally {
      setLoading(false);
    }
  }, [armLogoutTimer, clearSession]);

  //------------------------------------------
  // HANDOFF RESPONDER (serve token to new tabs / react to sibling logout)
  //------------------------------------------

  useEffect(() => {
    const cleanup = startHandoffResponder(
      () => ({
        token: getAccessToken(),
        expiresAt: Number(sessionStorage.getItem(EXPIRES_KEY)) || null,
      }),
      () => {
        // A sibling tab logged out.
        manualLogoutRef.current = true;
        clearSession();
        navigate("/login", { replace: true });
      },
    );
    return cleanup;
  }, [clearSession, navigate]);

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
      location.pathname.startsWith(route),
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
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
