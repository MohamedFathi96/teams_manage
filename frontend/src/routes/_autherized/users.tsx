import { createFileRoute } from "@tanstack/react-router";
import { UsersPage } from "@/features/users/page";

export const Route = createFileRoute("/_autherized/users")({
  component: UsersPage,
});
