import { useMemo } from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { Edit, Trash2, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/Pagination";
import type { ApiTask } from "@/types/app.type";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { useTasks } from "../services";

interface TasksTableProps {
  onEditTask: (task: ApiTask) => void;
  onDeleteTask: (task: ApiTask) => void;
  isDeleting: boolean;
  currentUserId?: string;
}

export function TasksTable({ onEditTask, onDeleteTask, isDeleting, currentUserId }: TasksTableProps) {
  const searchParams = useSearch({ from: "/_autherized/tasks" });
  const navigate = useNavigate();

  const queryParams = useMemo(
    () => ({
      search: searchParams.search || undefined,
      status: searchParams.status !== "all" ? searchParams.status : undefined,
      sortBy: (searchParams.sortBy || "createdAt") as "createdAt" | "updatedAt" | "title" | "status",
      sortOrder: (searchParams.sortOrder || "desc") as "asc" | "desc",
      page: searchParams.page || 1,
      limit: 20, // Reasonable limit for pagination
    }),
    [searchParams.search, searchParams.status, searchParams.sortBy, searchParams.sortOrder, searchParams.page]
  );

  const { data: tasksData, isLoading, error, refetch } = useTasks(queryParams);

  const tasks = tasksData?.data?.tasks || [];
  const pagination = tasksData?.meta?.pagination || {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  };
  const searchTerm = searchParams.search || "";

  // Debug pagination data
  console.log("Pagination data:", pagination);
  console.log("Tasks data:", tasksData);

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    navigate({
      to: "/tasks",
      search: { ...searchParams, page: newPage },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-12 text-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading tasks...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  // Empty state
  if (tasks.length === 0) {
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
            <TableHead>Task</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <div className="max-w-xs">
                  <p className="font-medium text-gray-900 truncate">{task.title}</p>
                  <p className="text-sm text-gray-500 truncate">{task.description}</p>
                </div>
              </TableCell>
              <TableCell>
                <TaskStatusBadge status={task.status} />
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-white">
                      {task.assignedTo.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{task.assignedTo.name}</p>
                    <p className="text-xs text-gray-500 truncate">{task.assignedTo.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-white">
                      {task.createdBy.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{task.createdBy.name}</p>
                    <p className="text-xs text-gray-500 truncate">{task.createdBy.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(task.createdAt)}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-500">{formatDateTime(task.updatedAt)}</span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    onClick={() => onEditTask(task)}
                    variant="outline"
                    size="sm"
                    className="inline-flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  {/* Only show delete button if current user is the creator */}
                  {currentUserId === task.createdBy.id && (
                    <Button
                      onClick={() => onDeleteTask(task)}
                      disabled={isDeleting}
                      variant="outline"
                      size="sm"
                      className="inline-flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Always render pagination for debugging */}
      <Pagination
        currentPage={pagination.page || 1}
        totalPages={pagination.totalPages || 1}
        totalItems={pagination.total || 0}
        itemsPerPage={pagination.limit || 20}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
