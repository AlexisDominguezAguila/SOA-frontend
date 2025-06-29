import { createContext, useState, useEffect } from "react";
import api from "@/services/api";
import { logoutSilent } from "@/utils/auth-helpers";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ───────────────── Rehidratación ───────────────── */
  useEffect(() => {
    const stored = localStorage.getItem("userInfo");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        api.defaults.headers.common.Authorization = `Bearer ${parsed.token}`;
      } catch (e) {
        console.error("Error al parsear userInfo:", e);
        logoutSilent();
      }
    }
    setLoading(false);
  }, []);

  /* ───────────────── API pública ─────────────────── */
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
    api.defaults.headers.common.Authorization = `Bearer ${userData.token}`;
  };

  const logout = () => {
    logoutSilent();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
