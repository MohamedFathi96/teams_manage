import { ITaskDocument } from "@/models/Task.ts";

export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";

export interface CreateTaskDto {
  title: string;
  description: string;
  assignedTo: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignedTo?: string;
}

export interface TaskQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus;
  assignedTo?: string;
  createdBy?: string;
  sortBy?: "createdAt" | "updatedAt" | "title" | "status";
  sortOrder?: "asc" | "desc";
}

export interface TaskResponse {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo: {
    id: string;
    name: string;
    email: string;
  };
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TasksListResponse {
  tasks: TaskResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TaskFilters {
  status?: TaskStatus;
  assignedTo?: string;
  createdBy?: string;
  search?: string;
}
