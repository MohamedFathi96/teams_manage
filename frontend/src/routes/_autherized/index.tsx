import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_autherized/")({
  component: Home,
});

function Home() {
  const auth = Route.useRouteContext().auth;

  return (
    <div className="text-center">
      <div className="mx-auto max-w-md">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Teams!</h2>
          <p className="text-gray-600 mb-6">
            Hello, <span className="font-medium text-indigo-600">{auth?.user?.name}</span>! You're successfully logged
            in.
          </p>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              This is your protected home page. Only authenticated users can see this content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
