import { useState, useMemo } from "react";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, useAllTaskStats } from "./services";
import type { ApiTask, TaskStatus, CreateTaskRequest, UpdateTaskRequest } from "@/types/app.type";
import { LoadingState, ErrorState, TasksHeader, TasksSearch, TasksTable, TaskForm, TaskStats } from "./components";
import { useAuth } from "@/contexts/AuthContext";

export function TasksPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ApiTask | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  // Query parameters for API
  const queryParams = useMemo(
    () => ({
      search: searchTerm || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      sortBy: sortBy as any,
      sortOrder,
      limit: 50, // Reasonable limit for now
    }),
    [searchTerm, statusFilter, sortBy, sortOrder]
  );

  const { data: tasksData, isLoading, error, refetch } = useTasks(queryParams);
  const { data: statsData, isLoading: isStatsLoading } = useAllTaskStats();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const tasks = tasksData?.data?.tasks || [];
  const stats = statsData?.data || {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
  };

  // Client-side filtering for search (since API handles server-side search too)
  const filteredTasks = tasks.filter((task) => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.assignedTo.name.toLowerCase().includes(searchLower) ||
        task.createdBy.name.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const handleCreateTask = () => {
    setFormMode("create");
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: ApiTask) => {
    setFormMode("edit");
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = async (task: ApiTask) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      try {
        await deleteTaskMutation.mutateAsync(task.id);
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const handleFormSubmit = async (data: CreateTaskRequest | UpdateTaskRequest) => {
    try {
      if (formMode === "create") {
        await createTaskMutation.mutateAsync(data as CreateTaskRequest);
      } else if (editingTask) {
        await updateTaskMutation.mutateAsync({
          taskId: editingTask.id,
          data: data as UpdateTaskRequest,
        });
      }
      setIsFormOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <TasksHeader onCreateTask={handleCreateTask} />

      <TaskStats stats={stats} isLoading={isStatsLoading} />

      <TasksSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        filteredCount={filteredTasks.length}
        totalCount={tasks.length}
      />

      <TasksTable
        tasks={filteredTasks}
        searchTerm={searchTerm}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        isDeleting={deleteTaskMutation.isPending}
        currentUserId={user?.id}
      />

      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        task={editingTask}
        isSubmitting={createTaskMutation.isPending || updateTaskMutation.isPending}
        mode={formMode}
      />
    </div>
  );
}
