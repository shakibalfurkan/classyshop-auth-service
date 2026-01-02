import Login from "@/pages/Login/Login";
import Signup from "@/pages/Signup/Signup";
import VerifyOTP from "@/pages/VerifyOtp/VerifyOtp";
import type { RouteObject } from "react-router";

export const authRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/verify-otp",
    element: <VerifyOTP />,
  },
];
