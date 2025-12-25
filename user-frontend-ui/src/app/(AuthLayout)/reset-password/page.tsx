"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { resetPasswordSchema } from "@/schemas/auth.schema";
import { AlertCircleIcon } from "lucide-react";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetUserPassword } from "@/hooks/auth.hook";

type TFormData = {
  newPassword: string;
  confirmNewPassword: string;
};

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isNewConfirmPasswordVisible, setIsNewConfirmPasswordVisible] =
    useState(false);

  const {
    mutate: resetPassword,
    isSuccess,
    isPending,
    isError,
    error,
  } = useResetUserPassword();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = (data: TFormData) => {
    if (token && data.newPassword && data.confirmNewPassword) {
      resetPassword({ newPassword: data.newPassword, token });
    }
  };

  useEffect(() => {
    if (!isPending && isSuccess) {
      router.push("/login");
    }
  }, [isPending, isSuccess, router]);

  return (
    <section className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col items-center justify-center min-h-[87vh] w-full gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mt-2.5 mb-4">Reset password</h1>
          <p className="font-medium text-gray-500">
            We send a password reset link to your email
          </p>
        </div>
        <div className="w-full max-w-md border rounded-lg p-6 shadow-sm">
          {isError && (
            <Alert
              variant="destructive"
              className="mb-5 border-red-500 bg-red-50"
            >
              <AlertCircleIcon />
              <AlertTitle>Unable to reset password.</AlertTitle>
              <AlertDescription>
                <p>{error?.message}</p>
              </AlertDescription>
            </Alert>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="relative">
                <Controller
                  name="newPassword"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="newPassword">Password</FieldLabel>
                      <Input
                        {...field}
                        id="newPassword"
                        type={isNewPasswordVisible ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        placeholder="New password"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <p
                  onClick={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
                  className={`absolute  ${
                    errors.confirmNewPassword ? "top-[42%]" : "top-[60%]"
                  } right-3 cursor-pointer text-lg`}
                >
                  {isNewPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </p>
              </div>
              <div className="relative">
                <Controller
                  name="confirmNewPassword"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="confirmNewPassword">
                        Password
                      </FieldLabel>
                      <Input
                        {...field}
                        id="confirmNewPassword"
                        type={isNewConfirmPasswordVisible ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        placeholder="Confirm new password"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <p
                  onClick={() =>
                    setIsNewConfirmPasswordVisible(!isNewConfirmPasswordVisible)
                  }
                  className={`absolute  ${
                    errors.confirmNewPassword ? "top-[42%]" : "top-[60%]"
                  } right-3 cursor-pointer text-lg`}
                >
                  {isNewConfirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </p>
              </div>
            </FieldGroup>

            <Button
              disabled={isPending || !token}
              type="submit"
              className="w-full hover:cursor-pointer"
            >
              {isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
