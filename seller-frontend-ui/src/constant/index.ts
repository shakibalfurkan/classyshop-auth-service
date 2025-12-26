export const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
];

export const isAuthRoute = (url?: string) =>
  AUTH_ROUTES.some((route) => url?.includes(route));

export const PRIVATE_ROUTES = [
  "/create-shop",
  "/profile",
  "/orders",
  "/change-password",
  "/cart",
  "/checkout",
];

export const isPrivateRoute = (url?: string) =>
  PRIVATE_ROUTES.some((route) => url?.includes(route));
