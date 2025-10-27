import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { useAuth } from "./contexts/AuthContext";

// Create a new router instance
const appRouter = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
});

const App = () => {
  const authContext = useAuth();

  return <RouterProvider router={appRouter} context={{ auth: authContext }} />;
};

export default App;
