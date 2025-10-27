import type { Request, Response, NextFunction } from "express";
import { getAllUsers, getUserById } from "../services/users.service.ts";
import { catchAsync } from "../utils/catchAsync.ts";
import { ApiResponseHelper } from "../utils/responceHelper.ts";

export const getUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit, search } = req.query;
  const currentUserId = (req as any).user.sub;

  const result = await getAllUsers(
    {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string,
    },
    currentUserId
  );

  const { users, total, page: currentPage, limit: currentLimit, totalPages } = result;

  res.status(200).json(
    ApiResponseHelper.paginated(
      { users, total },
      {
        page: currentPage,
        limit: currentLimit,
        total,
        totalPages,
      },
      "Users retrieved successfully"
    )
  );
});

export const getUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const user = await getUserById(userId);

  res.status(200).json(ApiResponseHelper.success(user, "User profile retrieved successfully"));
});
