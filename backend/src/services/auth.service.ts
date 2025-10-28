import { User } from "@/models/User";
import { BadRequestError, UnauthorizedError } from "@/errors/AppError";
import { signToken, generateRefreshToken, verifyRefreshToken } from "@/lib/jwt";
import { config } from "@/config/index";

export async function registerUser(params: { email: string; password: string; name: string }) {
  const existing = await User.findOne({ email: params.email });
  if (existing) throw new BadRequestError("Email is already in use");

  const user = await User.create(params);
  const token = signToken({ sub: user.id, email: user.email });
  const refreshToken = generateRefreshToken();
  const refreshTokenExpiresAt = new Date(Date.now() + config.jwtRefreshExpiresIn * 1000);

  // Save refresh token to user
  user.refreshToken = refreshToken;
  user.refreshTokenExpiresAt = refreshTokenExpiresAt;
  await user.save();

  return { user: sanitize(user), token, refreshToken };
}

export async function loginUser(params: { email: string; password: string }) {
  const user = await User.findOne({ email: params.email });
  if (!user) throw new UnauthorizedError("Email or password is incorrect");

  const passwordMatch = await user.comparePassword(params.password);
  if (!passwordMatch) throw new UnauthorizedError("Invalid credentials");

  const token = signToken({ sub: user.id, email: user.email });
  const refreshToken = generateRefreshToken();
  const refreshTokenExpiresAt = new Date(Date.now() + config.jwtRefreshExpiresIn * 1000);

  user.refreshToken = refreshToken;
  user.refreshTokenExpiresAt = refreshTokenExpiresAt;
  await user.save();

  return { user: sanitize(user), token, refreshToken };
}

export async function refreshTokens(refreshToken: string) {
  if (!refreshToken) throw new UnauthorizedError("Refresh token is required");

  const user = await User.findOne({
    refreshToken,
    refreshTokenExpiresAt: { $gt: new Date() },
  });

  if (!user) throw new UnauthorizedError("Invalid or expired refresh token");

  const newAccessToken = signToken({ sub: user.id, email: user.email });
  const newRefreshToken = generateRefreshToken();
  const refreshTokenExpiresAt = new Date(Date.now() + config.jwtRefreshExpiresIn * 1000);

  user.refreshToken = newRefreshToken;
  user.refreshTokenExpiresAt = refreshTokenExpiresAt;
  await user.save();

  return {
    user: sanitize(user),
    token: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

export async function logoutUser(refreshToken: string) {
  if (!refreshToken) throw new BadRequestError("Refresh token is required");

  const user = await User.findOne({ refreshToken });
  if (user) {
    user.refreshToken = undefined;
    user.refreshTokenExpiresAt = undefined;
    await user.save();
  }

  return { message: "Logged out successfully" };
}

function sanitize(user: any) {
  const obj = user.toObject?.() ?? user;
  delete obj.password;
  delete obj.refreshToken;
  delete obj.refreshTokenExpiresAt;
  return obj;
}
