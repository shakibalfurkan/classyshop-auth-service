// routes/setup.routes.tsx
import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router";
import PrivateRoute from "@/middleware/PrivateRoute";

const CreateShop = lazy(() => import("@/pages/CreateShop/CreateShop"));
const StripeRefresh = lazy(() => import("@/pages/StripeRefresh/StripeRefresh"));
const StripeSuccess = lazy(() => import("@/pages/StripeSuccess/StripeSuccess"));
const StripeConnect = lazy(() => import("@/pages/StripeConnect/StripeConnect"));

export const setupRoutes: RouteObject[] = [
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "create-shop",
        element: (
          <Suspense fallback={null}>
            <CreateShop />
          </Suspense>
        ),
      },
      {
        path: "stripe-connect",
        element: (
          <Suspense fallback={null}>
            <StripeConnect />
          </Suspense>
        ),
      },
      {
        path: "stripe-refresh",
        element: (
          <Suspense fallback={null}>
            <StripeRefresh />
          </Suspense>
        ),
      },
      {
        path: "stripe-success",
        element: (
          <Suspense fallback={null}>
            <StripeSuccess />
          </Suspense>
        ),
      },
    ],
  },
];
