import { useMemo } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, useAllTaskStats } from "./services";
import type { ApiTask, CreateTaskRequest, UpdateTaskRequest } from "@/types/app.type";
import { LoadingState, ErrorState, TasksHeader, TasksSearch, TasksTable, TaskForm, TaskStats } from "./components";
import { useAuth } from "@/contexts/AuthContext";

export function TasksPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const searchParams = useSearch({ from: "/_autherized/tasks" });

  const isFormOpen = searchParams.create === "true" || searchParams.edit !== undefined;
  const editingTaskId = searchParams.edit;
  const formMode = searchParams.create === "true" ? "create" : "edit";

  const queryParams = useMemo(
    () => ({
      search: searchParams.search || undefined,
      status: searchParams.status !== "all" ? searchParams.status : undefined,
      sortBy: (searchParams.sortBy || "createdAt") as "createdAt" | "updatedAt" | "title" | "status",
      sortOrder: (searchParams.sortOrder || "desc") as "asc" | "desc",
      limit: 50, // Reasonable limit for now
    }),
    [searchParams.search, searchParams.status, searchParams.sortBy, searchParams.sortOrder]
  );

  const { data: tasksData, isLoading, error, refetch } = useTasks(queryParams);
  const { data: statsData, isLoading: isStatsLoading } = useAllTaskStats();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const tasks = tasksData?.data?.tasks || [];
  const totalTasks = tasksData?.meta?.pagination?.total || 0;
  const stats = statsData?.data || {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
  };

  const editingTask = editingTaskId ? tasks.find((task) => task.id === editingTaskId) || null : null;

  const handleCreateTask = () => {
    navigate({
      to: "/tasks",
      search: { ...searchParams, create: "true" },
    });
  };

  const handleEditTask = (task: ApiTask) => {
    navigate({
      to: "/tasks",
      search: { ...searchParams, edit: task.id },
    });
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
      // Close form by removing search params
      navigate({
        to: "/tasks",
        search: {
          search: searchParams.search,
          status: searchParams.status,
          sortBy: searchParams.sortBy,
          sortOrder: searchParams.sortOrder,
        },
      });
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  const handleCloseForm = () => {
    // Close form by removing search params
    navigate({
      to: "/tasks",
      search: {
        search: searchParams.search,
        status: searchParams.status,
        sortBy: searchParams.sortBy,
        sortOrder: searchParams.sortOrder,
      },
    });
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <TasksHeader onCreateTask={handleCreateTask} />

      <TaskStats stats={stats} isLoading={isStatsLoading} />

      <TasksSearch filteredCount={tasks.length} totalCount={totalTasks} />

      <TasksTable
        tasks={tasks}
        searchTerm={searchParams.search || ""}
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
