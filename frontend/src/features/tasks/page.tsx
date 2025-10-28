import { useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCreateTask, useUpdateTask, useDeleteTask, useTask } from "./services";
import type { ApiTask, CreateTaskRequest, UpdateTaskRequest } from "@/types/app.type";
import { TasksHeader, TasksSearch, TasksTable, TaskForm, TaskStats } from "./components";
import { useAuth } from "@/contexts/AuthContext";

export function TasksPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const searchParams = useSearch({ from: "/_autherized/tasks" });

  // State for task counts from TasksTable
  const [taskCounts, setTaskCounts] = useState({ current: 0, total: 0 });

  const isFormOpen = searchParams.create === "true" || searchParams.edit !== undefined;
  const editingTaskId = searchParams.edit;
  const formMode = searchParams.create === "true" ? "create" : "edit";

  const { data: editingTaskData } = useTask(editingTaskId || "");
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const editingTask = editingTaskData?.data || null;

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

  return (
    <div className="space-y-6">
      <TasksHeader onCreateTask={handleCreateTask} />

      <TaskStats />

      <TasksSearch filteredCount={taskCounts.current} totalCount={taskCounts.total} />

      <TasksTable
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
