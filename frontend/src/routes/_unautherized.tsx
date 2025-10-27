import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_unautherized")({
  beforeLoad: ({ context }) => {
    // Redirect to home if already authenticated
    if (context.auth?.accessToken) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: UnauthorizedLayout,
});

function UnauthorizedLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
}
