// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiClient, setupInterceptors } from "@/lib/axios";
import type { ApiUser } from "@/types/app.type";

export type AuthContextType = {
  user: ApiUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (token: string, user: ApiUser, refreshToken: string) => void;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ApiUser | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("accessToken"));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem("refreshToken"));

  const login = (token: string, userData: ApiUser, refreshTokenValue: string) => {
    setAccessToken(token);
    setUser(userData);
    setRefreshToken(refreshTokenValue);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refreshTokenValue);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = useCallback(async () => {
    try {
      if (refreshToken) {
        await apiClient.post("/auth/logout", { refreshToken });
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      setAccessToken(null);
      setUser(null);
      setRefreshToken(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  }, [refreshToken]);

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) throw new Error("No refresh token available");

    try {
      const response = await apiClient.post("/auth/refresh", { refreshToken });
      const { token, refreshToken: newRefreshToken, user: updatedUser } = response.data.data;

      setAccessToken(token);
      setRefreshToken(newRefreshToken);
      setUser(updatedUser);

      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", newRefreshToken);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      await logout();
      throw error;
    }
  }, [refreshToken, logout]);

  useEffect(() => {
    setupInterceptors(() => accessToken, refreshAccessToken);
  }, [accessToken, refreshAccessToken]);

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshToken, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
