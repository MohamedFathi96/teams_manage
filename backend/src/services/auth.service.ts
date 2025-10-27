import { User } from "@/models/User.ts";
import { BadRequestError, UnauthorizedError } from "@/errors/AppError.ts";
import { signToken } from "@/lib/jwt.ts";

export async function registerUser(params: { email: string; password: string; name: string }) {
  const existing = await User.findOne({ email: params.email });
  if (existing) throw new BadRequestError("Email is already in use");

  const user = await User.create(params);
  const token = signToken({ sub: user.id, email: user.email });

  return { user: sanitize(user), token };
}

export async function loginUser(params: { email: string; password: string }) {
  const user = await User.findOne({ email: params.email });
  if (!user) throw new UnauthorizedError("Email or password is incorrect");

  const passwordMatch = await user.comparePassword(params.password);
  if (!passwordMatch) throw new UnauthorizedError("Invalid credentials");

  const token = signToken({ sub: user.id, email: user.email });
  return { user: sanitize(user), token };
}

function sanitize(user: any) {
  const obj = user.toObject?.() ?? user;
  delete obj.password;
  return obj;
}
