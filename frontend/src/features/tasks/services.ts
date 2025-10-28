import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import type {
  ApiTask,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskQueryParams,
  TaskStats,
  ApiUser,
} from "@/types/app.type";
import type { SuccessResponse } from "@/types/api.type";

// Types
export type TasksListResponse = SuccessResponse<{
  tasks: ApiTask[];
  total: number;
}> & {
  meta: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export type TaskResponse = SuccessResponse<ApiTask>;
export type TaskStatsResponse = SuccessResponse<TaskStats>;
export type UsersListResponse = SuccessResponse<{
  users: ApiUser[];
  total: number;
}>;

// API functions
export const tasksApi = {
  getTasks: async (params?: TaskQueryParams): Promise<TasksListResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.assignedTo) searchParams.append("assignedTo", params.assignedTo);
    if (params?.createdBy) searchParams.append("createdBy", params.createdBy);
    if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);

    const queryString = searchParams.toString();
    const url = queryString ? `/tasks?${queryString}` : "/tasks";

    const response = await apiClient.get(url);
    return response.data;
  },

  getTask: async (taskId: string): Promise<TaskResponse> => {
    const response = await apiClient.get(`/tasks/${taskId}`);
    return response.data;
  },

  createTask: async (data: CreateTaskRequest): Promise<TaskResponse> => {
    const response = await apiClient.post("/tasks", data);
    return response.data;
  },

  updateTask: async (taskId: string, data: UpdateTaskRequest): Promise<TaskResponse> => {
    const response = await apiClient.put(`/tasks/${taskId}`, data);
    return response.data;
  },

  deleteTask: async (taskId: string): Promise<SuccessResponse<null>> => {
    const response = await apiClient.delete(`/tasks/${taskId}`);
    return response.data;
  },

  getMyTasks: async (params?: { status?: string; search?: string }): Promise<SuccessResponse<ApiTask[]>> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append("status", params.status);
    if (params?.search) searchParams.append("search", params.search);

    const queryString = searchParams.toString();
    const url = queryString ? `/tasks/my/tasks?${queryString}` : "/tasks/my/tasks";

    const response = await apiClient.get(url);
    return response.data;
  },

  getTaskStats: async (userId?: string): Promise<TaskStatsResponse> => {
    const url = userId ? `/tasks/stats/user?userId=${userId}` : "/tasks/stats/user";
    const response = await apiClient.get(url);
    return response.data;
  },

  getAllTaskStats: async (): Promise<TaskStatsResponse> => {
    const response = await apiClient.get("/tasks/stats/all");
    return response.data;
  },

  // Helper to get users for assignment
  getUsers: async (): Promise<UsersListResponse> => {
    const response = await apiClient.get("/users");
    return response.data;
  },
};

// Hooks
export function useTasks(params?: TaskQueryParams) {
  return useQuery({
    queryKey: ["tasks", params],
    queryFn: () => tasksApi.getTasks(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useInfiniteTasks(params?: Omit<TaskQueryParams, "page">) {
  return useInfiniteQuery({
    queryKey: ["infinite-tasks", params],
    queryFn: ({ pageParam = 1 }) => tasksApi.getTasks({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.meta?.pagination;
      if (pagination && pagination.page < pagination.totalPages) {
        return pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useTask(taskId: string) {
  return useQuery({
    queryKey: ["tasks", taskId],
    queryFn: () => tasksApi.getTask(taskId),
    enabled: !!taskId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task-stats"] });
    },
    onError: (error) => {
      console.error("Failed to create task:", error);
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskRequest }) => tasksApi.updateTask(taskId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ["task-stats"] });
    },
    onError: (error) => {
      console.error("Failed to update task:", error);
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task-stats"] });
    },
    onError: (error) => {
      console.error("Failed to delete task:", error);
    },
  });
}

export function useMyTasks(params?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ["my-tasks", params],
    queryFn: () => tasksApi.getMyTasks(params),
    staleTime: 2 * 60 * 1000,
  });
}

export function useTaskStats(userId?: string) {
  return useQuery({
    queryKey: ["task-stats", userId],
    queryFn: () => tasksApi.getTaskStats(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAllTaskStats() {
  return useQuery({
    queryKey: ["task-stats", "all"],
    queryFn: tasksApi.getAllTaskStats,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUsersForAssignment() {
  return useQuery({
    queryKey: ["users-for-assignment"],
    queryFn: tasksApi.getUsers,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
