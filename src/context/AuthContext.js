



import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

// ================= CREATE CONTEXT =================
const AuthContext = createContext(null);

// ================= CUSTOM HOOK =================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// ================= PROVIDER =================
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const navigationRef = useRef(navigate);
  const logoutTimerRef = useRef(null);

  useEffect(() => {
    navigationRef.current = navigate;
  }, [navigate]);

  // ================= STATE =================
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [tenantId, setTenantId] = useState(null);
  const [roleData, setRoleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiry, setSessionExpiry] = useState(null);

  const isAuthenticated = !!token;

  // ================= INIT =================
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        const storedTenantId = localStorage.getItem("tenantId");
        const storedRoleData = localStorage.getItem("roleData");
        const storedExpiry = localStorage.getItem("sessionExpiry");

        if (storedToken && storedUser) {
          if (
            storedExpiry &&
            new Date().getTime() > parseInt(storedExpiry)
          ) {
            clearAuthData();
            toast.info("Session expired. Please login again.");
          } else {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setTenantId(storedTenantId);
            setRoleData(
              storedRoleData ? JSON.parse(storedRoleData) : null
            );
            setSessionExpiry(
              storedExpiry ? parseInt(storedExpiry) : null
            );

            // restart auto logout timer
            if (storedExpiry) {
              setupAutoLogout(parseInt(storedExpiry));
            }
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ================= CLEAR AUTH =================
  const clearAuthData = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tenantId");
    localStorage.removeItem("roleData");
    localStorage.removeItem("sessionExpiry");

    Cookies.remove("userToken");

    setToken(null);
    setUser(null);
    setTenantId(null);
    setRoleData(null);
    setSessionExpiry(null);

    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
  }, []);

  // ================= EXPIRY =================
  const calculateExpiry = useCallback((expiryTime) => {
    const now = new Date().getTime();

    const expiryMap = {
      "1min": 60 * 1000,
      "5min": 5 * 60 * 1000,
      "30min": 30 * 60 * 1000,
      "4hours": 4 * 60 * 60 * 1000,
      "8hours": 8 * 60 * 60 * 1000,
    };

    return now + (expiryMap[expiryTime] || 30 * 60 * 1000);
  }, []);

  // ================= AUTO LOGOUT =================
  const setupAutoLogout = useCallback(
    (expiryTimestamp) => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }

      const timeLeft = expiryTimestamp - new Date().getTime();

      if (timeLeft > 0) {
        logoutTimerRef.current = setTimeout(() => {
          toast.warning("Session expired. Please login again.");
          logout(false);
        }, timeLeft);
      }
    },
    [] // don't depend on logout to avoid re-creating
  );

  // ================= LOGIN =================
  const login = async (email, password, expiryTime) => {
    setLoading(true);
    try {
      const response = await authAPI.login(email, password, expiryTime);

      const { token, user, roleData } = response.data;

      const expiryTimestamp = calculateExpiry(expiryTime);

      // Store
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("tenantId", user.tenantId);
      localStorage.setItem("sessionExpiry", expiryTimestamp.toString());

      if (roleData) {
        localStorage.setItem("roleData", JSON.stringify(roleData));
      }

      Cookies.set("userToken", token, { expires: 7 });

      // State
      setToken(token);
      setUser(user);
      setTenantId(user.tenantId);
      setRoleData(roleData);
      setSessionExpiry(expiryTimestamp);

      setupAutoLogout(expiryTimestamp);

      return { success: true, user };
    } catch (error) {
      console.error("Login error:", error);

      return {
        success: false,
        error:
          error.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGOUT =================
  const logout = useCallback(async (logoutAll = false) => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          if (logoutAll && authAPI.logoutAllDevices) {
            await authAPI.logoutAllDevices();
          } else {
            await authAPI.logout();
          }
          toast.success("Logged out successfully");
        } catch (err) {
          console.warn("Logout API failed:", err);
          toast.info("Session cleared locally");
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuthData();
      setLoading(false);

       setTimeout(() => {
    navigate("/login", { replace: true });
  }, 100);
    }
  }, [clearAuthData]);

  // ================= ROLE HELPERS =================
  const hasRole = useCallback(
    (roles) => {
      if (!user) return false;
      return Array.isArray(roles)
        ? roles.includes(user.role)
        : user.role === roles;
    },
    [user]
  );

  const isAdmin = useCallback(() => user?.role === "admin", [user]);
  const isTeamMember = useCallback(
    () => user?.role === "team_member",
    [user]
  );

  const getPermissions = useCallback(() => {
    return roleData?.permissions || {};
  }, [roleData]);

  // ================= UPDATE USER =================
  const updateUserData = useCallback(
    (updatedData) => {
      const updatedUser = { ...user, ...updatedData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    },
    [user]
  );

  // ================= CONTEXT VALUE =================
  const value = {
    user,
    token,
    tenantId,
    roleData,
    loading,
    isAuthenticated,
    login,
    logout,
    hasRole,
    isAdmin,
    isTeamMember,
    getPermissions,
    updateUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;