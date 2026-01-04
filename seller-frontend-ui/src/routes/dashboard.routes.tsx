import PrivateRoute from "@/middleware/PrivateRoute";
import { Navigate, type RouteObject } from "react-router";
import { lazy, Suspense } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import ShopRoute from "@/middleware/ShopRoute";

const Dashboard = lazy(() => import("@/pages/Dashboard/Dashboard"));

export const dashboardRoutes: RouteObject[] = [
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <ShopRoute />,
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
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
