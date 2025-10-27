import { useState } from "react";
import { useUsers, useStartChat } from "./services";
import type { ApiUser } from "@/types/app.type";
import { LoadingState, ErrorState, UsersHeader, UsersSearch, UsersTable } from "./components";
import { useNavigate } from "@tanstack/react-router";

export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: usersData, isLoading, error, refetch } = useUsers();
  const startChatMutation = useStartChat();
  const navigate = useNavigate();

  const users = usersData?.data?.users || [];
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartChat = async (user: ApiUser) => {
    try {
      await startChatMutation.mutateAsync({ userId: user.id });
      navigate({ to: "/chats" });
    } catch (error) {
      console.error("Failed to start chat:", error);
    }
  };

  return isLoading ? (
    <LoadingState />
  ) : error ? (
    <ErrorState onRetry={() => refetch()} />
  ) : (
    <div className="space-y-6">
      <UsersHeader />

      <UsersSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filteredCount={filteredUsers.length}
        totalCount={users.length}
      />

      <UsersTable
        users={filteredUsers}
        searchTerm={searchTerm}
        onStartChat={handleStartChat}
        isStartingChat={startChatMutation.isPending}
      />
    </div>
  );
}
