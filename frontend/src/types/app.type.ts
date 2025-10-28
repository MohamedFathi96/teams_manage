export type ApiUser = {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";

export type ApiTask = {
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
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskRequest = {
  title: string;
  description: string;
  assignedTo: string;
};

export type UpdateTaskRequest = {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignedTo?: string;
};

export type TaskQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus;
  assignedTo?: string;
  createdBy?: string;
  sortBy?: "createdAt" | "updatedAt" | "title" | "status";
  sortOrder?: "asc" | "desc";
};

export type TaskStats = {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
};
