import PrivateRoute from "@/middleware/PrivateRoute";
import { Navigate, type RouteObject } from "react-router";
import { lazy, Suspense } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";

const Dashboard = lazy(() => import("@/pages/Dashboard/Dashboard"));
const Withdrawals = lazy(() => import("@/pages/Withdrawals/Withdrawals"));

export const dashboardRoutes: RouteObject[] = [
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },

          {
            path: "dashboard",
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={null}>
                    <Dashboard />
                  </Suspense>
                ),
              },
              {
                path: "withdrawals",
                element: (
                  <Suspense fallback={null}>
                    <Withdrawals />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
];
