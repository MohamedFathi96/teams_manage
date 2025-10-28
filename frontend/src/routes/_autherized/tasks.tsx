import { createFileRoute } from "@tanstack/react-router";
import { TasksPage } from "@/features/tasks/page";

export const Route = createFileRoute("/_autherized/tasks")({
  component: TasksPage,
});
