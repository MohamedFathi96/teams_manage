import { useState } from "react";
import { useUsers } from "./services";
import { LoadingState, ErrorState, UsersHeader, UsersSearch, UsersTable } from "./components";

export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: usersData, isLoading, error, refetch } = useUsers();

  const users = usersData?.data?.users || [];
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <UsersTable users={filteredUsers} searchTerm={searchTerm} />
    </div>
  );
}
