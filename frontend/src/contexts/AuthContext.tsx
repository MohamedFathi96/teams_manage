// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient, setupInterceptors } from "@/lib/axios";
import type { ApiUser } from "@/types/app.type";

type AuthContextType = {
  user: ApiUser | null;
  accessToken: string | null;
  login: (token: string, user: ApiUser) => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ApiUser | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("accessToken"));

  const login = (token: string, userData: ApiUser) => {
    setAccessToken(token);
    setUser(userData);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  const refreshToken = async () => {
    const res = await apiClient.post("/auth/refresh");
    setAccessToken(res.data.accessToken);
    localStorage.setItem("accessToken", res.data.accessToken);
  };

  useEffect(() => {
    setupInterceptors(() => accessToken, refreshToken);
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, refreshToken }}>{children}</AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
