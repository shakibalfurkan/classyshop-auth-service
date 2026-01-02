import { createBrowserRouter } from "react-router";

import NotFound from "@/pages/NotFound/NotFound";
import { authRoutes } from "./auth.routes";
import { dashboardRoutes } from "./dashboard.routes";
import { setupRoutes } from "./setup.routes";

export const router: ReturnType<typeof createBrowserRouter> =
  createBrowserRouter([
    ...authRoutes,
    ...dashboardRoutes,
    ...setupRoutes,
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
