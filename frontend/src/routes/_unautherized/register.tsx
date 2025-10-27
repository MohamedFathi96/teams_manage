import { createFileRoute } from "@tanstack/react-router";
import RegisterPage from "../../features/auth/pages/register";

export const Route = createFileRoute("/_unautherized/register")({
  component: RegisterPage,
});
