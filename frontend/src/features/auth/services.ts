import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/axios";
import type { AxiosError } from "node_modules/axios/index.d.cts";
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
  LogoutRequest,
  LogoutResponse,
} from "./types";

// API functions
export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post("/auth/refresh", { refreshToken });
    return response.data;
  },

  logout: async (data: LogoutRequest): Promise<LogoutResponse> => {
    const response = await apiClient.post("/auth/logout", data);
    return response.data;
  },
};

export function useLogin() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response: LoginResponse) => {
      login(response.data.token, response.data.user, response.data.refreshToken);
    },
    onError: (error: AxiosError) => {
      console.error("Login failed:", error.message);
    },
  });
}

export function useRegister() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response) => {
      login(response.data.token, response.data.user, response.data.refreshToken);
    },
    onError: (error: AxiosError) => {
      console.error("Registration failed:", error.message);
    },
  });
}

export function useLogout() {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: () => logout(),
    onError: (error: AxiosError) => {
      console.error("Logout failed:", error.message);
    },
  });
}
