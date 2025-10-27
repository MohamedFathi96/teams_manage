import { MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ApiUser } from "@/types/app.type";
import { EmptyState } from "./EmptyState";

interface UsersTableProps {
  users: ApiUser[];
  searchTerm: string;
  onStartChat: (user: ApiUser) => void;
  isStartingChat: boolean;
}

export function UsersTable({ users, searchTerm, onStartChat, isStartingChat }: UsersTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <EmptyState searchTerm={searchTerm} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-white">
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name || "Anonymous"}</p>
                    <p className="text-sm text-gray-500">ID: {user.id}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-gray-900">{user.email}</span>
              </TableCell>
              <TableCell>
                <span className="text-gray-500">{formatDate(user.createdAt)}</span>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  onClick={() => onStartChat(user)}
                  disabled={isStartingChat}
                  size="sm"
                  className="inline-flex items-center"
                >
                  {isStartingChat ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <MessageCircle className="w-4 h-4 mr-2" />
                  )}
                  Start Chat
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
