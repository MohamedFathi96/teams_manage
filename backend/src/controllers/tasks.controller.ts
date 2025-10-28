import type { Request, Response, NextFunction } from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByUser,
  getTaskStats,
} from "../services/tasks.service.ts";
import { catchAsync } from "../utils/catchAsync.js";
import { ApiResponseHelper } from "../utils/responceHelper.js";
import { CreateTaskDto, UpdateTaskDto, TaskQueryParams } from "@/types/task.types.js";

export const createTaskHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const taskData: CreateTaskDto = req.body;
  const createdById = (req as any).user.sub;

  const task = await createTask(taskData, createdById);

  res.status(201).json(ApiResponseHelper.success(task, "Task created successfully"));
});

export const getTasksHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const queryParams: TaskQueryParams = {
    page: req.query.page ? parseInt(req.query.page as string) : undefined,
    limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    search: req.query.search as string,
    status: req.query.status as any,
    assignedTo: req.query.assignedTo as string,
    createdBy: req.query.createdBy as string,
    sortBy: req.query.sortBy as any,
    sortOrder: req.query.sortOrder as any,
  };

  const requesterId = (req as any).user.sub;
  const result = await getAllTasks(queryParams, requesterId);

  res.status(200).json(
    ApiResponseHelper.paginated(
      { tasks: result.tasks, total: result.total },
      {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
      "Tasks retrieved successfully"
    )
  );
});

export const getTaskHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { taskId } = req.params;
  const requesterId = (req as any).user.sub;

  const task = await getTaskById(taskId, requesterId);

  res.status(200).json(ApiResponseHelper.success(task, "Task retrieved successfully"));
});

export const updateTaskHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { taskId } = req.params;
  const updateData: UpdateTaskDto = req.body;
  const requesterId = (req as any).user.sub;

  const task = await updateTask(taskId, updateData, requesterId);

  res.status(200).json(ApiResponseHelper.success(task, "Task updated successfully"));
});

export const deleteTaskHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { taskId } = req.params;
  const requesterId = (req as any).user.sub;

  await deleteTask(taskId, requesterId);

  res.status(200).json(ApiResponseHelper.success(null, "Task deleted successfully"));
});

export const getUserTasksHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const requesterId = (req as any).user.sub;

  const filters = {
    status: req.query.status as any,
    search: req.query.search as string,
  };

  const tasks = await getTasksByUser(userId, filters, requesterId);

  res.status(200).json(ApiResponseHelper.success(tasks, "User tasks retrieved successfully"));
});

export const getMyTasksHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const requesterId = (req as any).user.sub;

  const filters = {
    status: req.query.status as any,
    search: req.query.search as string,
  };

  const tasks = await getTasksByUser(requesterId, filters, requesterId);

  res.status(200).json(ApiResponseHelper.success(tasks, "My tasks retrieved successfully"));
});

export const getTaskStatsHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.query;
  const requesterId = (req as any).user.sub;

  // If no userId is provided, get stats for the requesting user
  const targetUserId = (userId as string) || requesterId;

  const stats = await getTaskStats(targetUserId);

  res.status(200).json(ApiResponseHelper.success(stats, "Task statistics retrieved successfully"));
});

export const getAllTaskStatsHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const stats = await getTaskStats();

  res.status(200).json(ApiResponseHelper.success(stats, "All task statistics retrieved successfully"));
});
