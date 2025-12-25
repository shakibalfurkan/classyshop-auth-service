"use client";

import GoogleLogin from "@/components/shared/auth/GoogleLogin";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SeparatorWithText } from "@/components/ui/separator";
import { signupSchema } from "@/schemas/auth.schema";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, set, useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignupContext } from "@/context/signup.provider";
import { useUserRegistration } from "@/hooks/auth.hook";

type TFormData = {
  name: string;
  email: string;
  password: string;
};

export default function Signup() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const redirect = useSearchParams().get("redirect");
  const router = useRouter();

  const { setSignupData } = useSignupContext();

  const {
    mutate: registerUser,
    data: userData,
    isSuccess,
    isPending,
    isError,
    error,
  } = useUserRegistration();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: TFormData) => {
    registerUser(data);
    setSignupData(data);
  };

  useEffect(() => {
    if (!isPending && isSuccess) {
      const verifyOtpUrl = redirect
        ? `/verify-otp?redirect=${redirect}`
        : "/verify-otp";
      router.push(verifyOtpUrl);
    }
  }, [isPending, isSuccess, redirect, router]);

  return (
    <section className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col items-center justify-center min-h-[87vh] w-full gap-8 ">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mt-2.5 mb-4">
            Sign Up your account
          </h1>
          <p className="font-medium text-gray-500">
            To use ClassyShop, Please enter your details.
          </p>
        </div>
        <div className="w-full max-w-md border rounded-lg p-6  shadow-sm">
          {isError && (
            <Alert
              variant="destructive"
              className="mb-5 border-red-500 bg-red-50"
            >
              <AlertCircleIcon />
              <AlertTitle>Unable to sing up.</AlertTitle>
              <AlertDescription>
                <p>{error?.message}</p>
              </AlertDescription>
            </Alert>
          )}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      type="name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your name"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="relative">
                <Controller
                  name="password"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Input
                        {...field}
                        id="password"
                        type={isPasswordVisible ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        placeholder="Password"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <p
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className={`absolute w-fit  ${
                    errors.password ? "top-[42%]" : "top-[60%]"
                  } right-3 cursor-pointer text-lg`}
                >
                  {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </p>
              </div>
            </FieldGroup>

            <Button
              disabled={isPending}
              type="submit"
              className="w-full hover:cursor-pointer"
            >
              {isPending ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
          <div className="flex items-center justify-center gap-2 mt-3 mb-5">
            <span className="text-sm font-medium text-gray-500">
              Already have an account?
            </span>
            <Link
              href="/login"
              className="font-medium text-primary text-sm hover:underline"
            >
              Sign In
            </Link>
          </div>
          <SeparatorWithText>Or continue with</SeparatorWithText>

          <div className="flex justify-center mt-4">
            <GoogleLogin />
          </div>
        </div>
      </div>
    </section>
  );
}
