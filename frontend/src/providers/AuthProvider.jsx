import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

const ROLE_REDIRECTS = {
  admin: "/admin-dashboard",
  teacher: "/teacher-dashboard",
  student: "/dashboard",
  mentor: "/dashboard",
  school: "/dashboard",
  organizer: "/dashboard"
};

export function getRoleRedirect(role) {
  return ROLE_REDIRECTS[role] || "/dashboard";
}

function normalizeLoginError(error) {
  if (!error.response) {
    return "Unable to connect to server. Please check your connection.";
  }

  const status = error.response.status;
  const errorCode = error.response.data?.errorCode;
  const backendMessage = error.response.data?.message;

  if (errorCode === "USER_NOT_FOUND") return "User not found";
  if (errorCode === "INVALID_PASSWORD") return "Invalid password";
  if (errorCode === "INVALID_PASSWORD_HASH" || errorCode === "PASSWORD_NOT_CONFIGURED") return "Authentication failed";
  if (status >= 500 || errorCode === "BCRYPT_COMPARE_FAILED" || errorCode === "JWT_GENERATION_FAILED") return "Server error";

  return backendMessage || "Authentication failed";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("skillverse_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((response) => {
        if (response.data?.success && response.data?.user) {
          setUser(response.data.user);
        } else {
          localStorage.removeItem("skillverse_token");
        }
      })
      .catch(() => {
        localStorage.removeItem("skillverse_token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (payload) => {
    setAuthError(null);
    try {
      const response = await api.post("/auth/login", {
        email: payload.email?.trim().toLowerCase(),
        password: payload.password
      });

      if (response.data?.success && response.data?.token) {
        localStorage.setItem("skillverse_token", response.data.token);
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }

      const message = response.data?.message || "Authentication failed";
      setAuthError(message);
      return { success: false, message };
    } catch (error) {
      const message = normalizeLoginError(error);
      setAuthError(message);
      return { success: false, message };
    }
  }, []);

  const register = useCallback(async (payload) => {
    setAuthError(null);
    try {
      const response = await api.post("/auth/register", payload);
      if (response.data?.token) {
        localStorage.setItem("skillverse_token", response.data.token);
        setUser(response.data.user);
      }
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      setAuthError(message);
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("skillverse_token");
    setUser(null);
    setAuthError(null);
  }, []);

  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, authError, login, register, logout, clearError }),
    [user, loading, authError, login, register, logout, clearError]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
