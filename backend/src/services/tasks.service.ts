import { Task, ITaskDocument } from "@/models/Task";
import { User } from "@/models/User";
import { NotFoundError, BadRequestError, ForbiddenError } from "@/errors/AppError";
import mongoose from "mongoose";
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskQueryParams,
  TaskResponse,
  TasksListResponse,
  TaskFilters,
} from "@/types/task.types";

export async function createTask(taskData: CreateTaskDto, createdById: string): Promise<TaskResponse> {
  // Validate that assignedTo user exists
  const assignedUser = await User.findById(taskData.assignedTo);
  if (!assignedUser) {
    throw new NotFoundError("Assigned user not found");
  }

  // Validate that creator exists
  const creator = await User.findById(createdById);
  if (!creator) {
    throw new NotFoundError("Creator user not found");
  }

  const task = new Task({
    title: taskData.title,
    description: taskData.description,
    assignedTo: new mongoose.Types.ObjectId(taskData.assignedTo),
    createdBy: new mongoose.Types.ObjectId(createdById),
  });

  await task.save();

  // Populate the task with user details
  const populatedTask = await Task.findById(task._id)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .lean();

  if (!populatedTask) {
    throw new Error("Failed to create task");
  }

  return formatTaskResponse(populatedTask);
}

export async function getAllTasks(params: TaskQueryParams, requesterId: string): Promise<TasksListResponse> {
  const {
    page = 1,
    limit = 20,
    search,
    status,
    assignedTo,
    createdBy,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const skip = (page - 1) * limit;

  // Build query
  const query: any = {};

  // Apply filters
  if (status) {
    query.status = status;
  }

  if (assignedTo) {
    query.assignedTo = new mongoose.Types.ObjectId(assignedTo);
  }

  if (createdBy) {
    query.createdBy = new mongoose.Types.ObjectId(createdBy);
  }

  if (search) {
    query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }];
  }

  // Build sort object
  const sort: any = {};
  sort[sortBy] = sortOrder === "asc" ? 1 : -1;

  // Execute query
  const [tasks, total] = await Promise.all([
    Task.find(query)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Task.countDocuments(query),
  ]);

  return {
    tasks: tasks.map(formatTaskResponse),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getTaskById(taskId: string, requesterId: string): Promise<TaskResponse> {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new BadRequestError("Invalid task ID");
  }

  const task = await Task.findById(taskId)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .lean();

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  return formatTaskResponse(task);
}

export async function updateTask(
  taskId: string,
  updateData: UpdateTaskDto,
  requesterId: string
): Promise<TaskResponse> {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new BadRequestError("Invalid task ID");
  }

  const task = await Task.findById(taskId);
  if (!task) {
    throw new NotFoundError("Task not found");
  }

  // Check if user has permission to update this task
  // Only the creator or assigned user can update the task
  const requesterObjectId = new mongoose.Types.ObjectId(requesterId);
  const canUpdate = task.createdBy.equals(requesterObjectId) || task.assignedTo.equals(requesterObjectId);

  if (!canUpdate) {
    throw new ForbiddenError("You don't have permission to update this task");
  }

  // If assignedTo is being updated, validate the new user exists
  if (updateData.assignedTo) {
    const assignedUser = await User.findById(updateData.assignedTo);
    if (!assignedUser) {
      throw new NotFoundError("Assigned user not found");
    }
    updateData.assignedTo = updateData.assignedTo;
  }

  // Update the task
  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    {
      ...updateData,
      ...(updateData.assignedTo && { assignedTo: new mongoose.Types.ObjectId(updateData.assignedTo) }),
    },
    { new: true, runValidators: true }
  )
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .lean();

  if (!updatedTask) {
    throw new Error("Failed to update task");
  }

  return formatTaskResponse(updatedTask);
}

export async function deleteTask(taskId: string, requesterId: string): Promise<void> {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new BadRequestError("Invalid task ID");
  }

  const task = await Task.findById(taskId);
  if (!task) {
    throw new NotFoundError("Task not found");
  }

  // Check if user has permission to delete this task
  // Only the creator can delete the task
  const requesterObjectId = new mongoose.Types.ObjectId(requesterId);
  if (!task.createdBy.equals(requesterObjectId)) {
    throw new ForbiddenError("You don't have permission to delete this task");
  }

  await Task.findByIdAndDelete(taskId);
}

export async function getTasksByUser(
  userId: string,
  filters: TaskFilters,
  requesterId: string
): Promise<TaskResponse[]> {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new BadRequestError("Invalid user ID");
  }

  // Build query for tasks assigned to or created by the user
  const query: any = {
    $or: [{ assignedTo: new mongoose.Types.ObjectId(userId) }, { createdBy: new mongoose.Types.ObjectId(userId) }],
  };

  // Apply additional filters
  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.search) {
    query.$and = query.$and || [];
    query.$and.push({
      $or: [
        { title: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } },
      ],
    });
  }

  const tasks = await Task.find(query)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .lean();

  return tasks.map(formatTaskResponse);
}

export async function getTaskStats(userId?: string): Promise<{
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}> {
  const matchStage: any = {};

  if (userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestError("Invalid user ID");
    }
    matchStage.$or = [
      { assignedTo: new mongoose.Types.ObjectId(userId) },
      { createdBy: new mongoose.Types.ObjectId(userId) },
    ];
  }

  const stats = await Task.aggregate([
    ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
        inProgress: { $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] } },
        completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
        cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
      },
    },
  ]);

  return (
    stats[0] || {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
    }
  );
}

function formatTaskResponse(task: any): TaskResponse {
  return {
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    status: task.status,
    assignedTo: {
      id: task.assignedTo._id.toString(),
      name: task.assignedTo.name,
      email: task.assignedTo.email,
    },
    createdBy: {
      id: task.createdBy._id.toString(),
      name: task.createdBy.name,
      email: task.createdBy.email,
    },
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}
