import { User } from "@/models/User";
import { NotFoundError } from "@/errors/AppError";
import mongoose from "mongoose";

export async function getAllUsers(params: { page?: number; limit?: number; search?: string }, currentUserId: string) {
  const { page = 1, limit = 50, search } = params;
  const skip = (page - 1) * limit;

  // Build query
  const query: any = {
    _id: { $ne: new mongoose.Types.ObjectId(currentUserId) },
  };

  if (search) {
    query.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];
  }

  // Execute query
  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password") // Exclude password field
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(query),
  ]);

  return {
    users: users.map(sanitizeUser),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getUserById(userId: string) {
  const user = await User.findById(userId).select("-password").lean();
  if (!user) throw new NotFoundError("User not found");

  return sanitizeUser(user);
}

function sanitizeUser(user: any) {
  const { password, ...sanitized } = user;
  return {
    id: sanitized._id.toString(),
    email: sanitized.email,
    name: sanitized.name,
    createdAt: sanitized.createdAt,
    updatedAt: sanitized.updatedAt,
  };
}
