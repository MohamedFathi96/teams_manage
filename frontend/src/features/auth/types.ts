import type { SuccessResponse } from "@/types/api.type";
import type { ApiUser } from "@/types/app.type";

// Request types
export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  name?: string;
};

// Response types
export type LoginResponse = SuccessResponse<{
  user: ApiUser;
  token: string;
  refreshToken: string;
}>;

export type RegisterResponse = SuccessResponse<{
  user: ApiUser;
  token: string;
  refreshToken: string;
}>;

export type RefreshTokenResponse = SuccessResponse<{
  user: ApiUser;
  token: string;
  refreshToken: string;
}>;

export type LogoutRequest = {
  refreshToken: string;
};

export type LogoutResponse = SuccessResponse<{
  message: string;
}>;
