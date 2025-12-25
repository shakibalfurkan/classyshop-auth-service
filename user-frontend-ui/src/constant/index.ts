import { TNavItems } from "@/types";

export const navItems: TNavItems[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Products",
    href: "/products",
  },
  {
    name: "Shops",
    href: "/shops",
  },
  {
    name: "Offers",
    href: "/offers",
  },
  {
    name: "Become A Seller",
    href: "/become-seller",
  },
];

export const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/logout",
  "/forgot-password",
  "/reset-password",
  "/token-check",
  "/verify-otp",
  "/refresh-token",
];

export const isAuthRoute = (url?: string) =>
  AUTH_ROUTES.some((route) => url?.includes(route));
