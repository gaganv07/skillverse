import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

// Role-based redirect mapping
const ROLE_REDIRECTS = {
  admin: "/admin-dashboard",
  teacher: "/teacher-dashboard",
  student: "/feed",
  mentor: "/feed",
  school: "/feed",
  organizer: "/feed"
};

export function getRoleRedirect(role) {
  return ROLE_REDIRECTS[role] || "/feed";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start true for initial session check
  const [authError, setAuthError] = useState(null);

  // On mount, check for existing session token
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

      // Unexpected response shape
      const message = response.data?.message || "Login failed. Please try again.";
      setAuthError(message);
      return { success: false, message };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (error.response?.status === 0
          ? "Unable to connect to server. Please check your connection."
          : error.response?.status >= 500
            ? "Server error. Please try again later."
            : "Login failed. Please try again.");

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
