import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("skillverse_token");
    if (!token) return;

    setLoading(true);
    api
      .get("/auth/me")
      .then((response) => setUser(response.data.user))
      .catch(() => localStorage.removeItem("skillverse_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (payload) => {
    const response = await api.post("/auth/login", payload);
    localStorage.setItem("skillverse_token", response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (payload) => {
    const response = await api.post("/auth/register", payload);
    localStorage.setItem("skillverse_token", response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("skillverse_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
