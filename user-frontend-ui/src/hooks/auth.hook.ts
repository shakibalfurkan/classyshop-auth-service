import {
  changeUserPassword,
  forgotUserPassword,
  loginUser,
  registerUser,
  resetUserPassword,
  verifyUser,
} from "@/services/AuthService";
import { useMutation } from "@tanstack/react-query";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

export const useUserRegistration = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["REGISTER_USER"],
    mutationFn: async (userData) => await registerUser(userData),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useVerifyUser = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["VERIFY_USER"],
    mutationFn: async (userData) => await verifyUser(userData),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useLoginUser = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["LOGIN_USER"],
    mutationFn: async (userData) => await loginUser(userData),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
export const useForgotUserPassword = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["FORGOT_USER_PASSWORD"],
    mutationFn: async (userData) => await forgotUserPassword(userData),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useResetUserPassword = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["RESET_USER_PASSWORD"],
    mutationFn: async (userData) => await resetUserPassword(userData),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useChangeUserPassword = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["CHANGE_USER_PASSWORD"],
    mutationFn: async (userData) => await changeUserPassword(userData),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
