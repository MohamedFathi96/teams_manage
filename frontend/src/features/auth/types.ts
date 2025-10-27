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
}>;

export type RegisterResponse = SuccessResponse<{
  user: ApiUser;
  token: string;
}>;
