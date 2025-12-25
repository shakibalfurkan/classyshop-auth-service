import axios, { isAxiosError } from "axios";
import { FieldValues } from "react-hook-form";
import axiosClient from "@/lib/Axios/axios-client";
import envConfig from "@/config/envConfig";

export const registerUser = async (userData: FieldValues) => {
  try {
    const { data } = await axiosClient.post(
      "/auth/api/v1/user/register",
      userData
    );
    return data;
  } catch (error) {
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
    const { data } = await axiosClient.post(
      "/auth/api/v1/user/verify",
      userData
    );
    return data;
  } catch (error) {
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
  try {
    const { data } = await axiosClient.post(
      "/auth/api/v1/user/login",
      userData
    );

    return data;
  } catch (error) {
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

export const logout = async () => {
  try {
    const { data } = await axios.post(
      `${envConfig.baseApi}/auth/api/v1/logout`,
      {},
      { withCredentials: true }
    );

    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to logout";

      throw new Error(message);
    }

    throw new Error("Something went wrong");
  }
};

export const forgotUserPassword = async (userData: FieldValues) => {
  try {
    const { data } = await axiosClient.post(
      "/auth/api/v1/user/forgot-password",
      userData
    );

    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Forgot password failed";

      throw new Error(message);
    }

    throw new Error("Something went wrong");
  }
};
export const resetUserPassword = async (userData: FieldValues) => {
  try {
    const { data } = await axiosClient.post(
      "/auth/api/v1/user/reset-password",
      userData
    );

    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Reset password failed";

      throw new Error(message);
    }

    throw new Error("Something went wrong");
  }
};
export const changeUserPassword = async (userData: FieldValues) => {
  try {
    const { data } = await axiosClient.post(
      "/auth/api/v1/user/change-password",
      userData
    );

    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Change password failed";

      throw new Error(message);
    }

    throw new Error("Something went wrong");
  }
};

export const tokenCheck = async (token: string) => {
  try {
    const { data } = await axiosClient.post(
      `/auth/api/v1/token-check?token=${token}`
    );
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Token check failed";

      throw new Error(message);
    }

    throw new Error("Something went wrong");
  }
};

export const getNewAccessToken = async () => {
  try {
    const res = await axiosClient.post("/auth/api/v1/refresh-token");

    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to get new access token";

      throw new Error(message);
    }

    throw new Error("Something went wrong");
  }
};

export const getUserFromDB = async () => {
  try {
    const { data } = await axiosClient.get(`/auth/api/v1/me`);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to get user from DB";

      throw new Error(message);
    }

    throw new Error("Something went wrong");
  }
};
