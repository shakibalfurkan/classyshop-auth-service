"use server";

import axiosInstance from "@/lib/AxiosInstance";
import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export const registerUser = async (userData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post(
      "/api/v1/user/register",
      userData
    );
    return data;
  } catch (error: any) {
    if (isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Register failed";
      throw new Error(message);
    }

    throw new Error("Something went wrong");
  }
};

export const verifyUser = async (userData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/api/v1/user/verify", userData);
    return data;
  } catch (error: any) {
    if (isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Verification failed";

      throw new Error(message);
    }

    throw new Error("Something went wrong");
  }
};

export const loginUser = async (userData: FieldValues) => {
  const nextCookies = await cookies();
  try {
    const { data } = await axiosInstance.post("/api/v1/user/login", userData);
    if (data.success) {
      nextCookies.set("accessToken", data?.data?.token?.accessToken);
      nextCookies.set("refreshToken", data?.data?.token?.refreshToken);
    }

    return data;
  } catch (error: any) {
    if (isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed";

      throw new Error(message);
    }

    throw new Error("Something went wrong");
  }
};
