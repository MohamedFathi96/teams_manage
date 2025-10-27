import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import type { ApiUser } from "@/types/app.type";
import type { SuccessResponse } from "@/types/api.type";

// Types
export type UsersListResponse = SuccessResponse<{
  users: ApiUser[];
  total: number;
}>;

export type StartChatRequest = {
  userId: string;
};

export type StartChatResponse = SuccessResponse<{
  chatId: string;
  message: string;
}>;

// API functions
export const usersApi = {
  getUsers: async (): Promise<UsersListResponse> => {
    const response = await apiClient.get("/users");
    return response.data;
  },

  startChat: async (data: StartChatRequest): Promise<StartChatResponse> => {
    const response = await apiClient.post("/chats/start", data);
    return response.data;
  },
};

// Hooks
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: usersApi.getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useStartChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.startChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onError: (error) => {
      console.error("Failed to start chat:", error);
    },
  });
}
