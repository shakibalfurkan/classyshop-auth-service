"use client";

import GoogleLogin from "@/components/shared/auth/GoogleLogin";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SeparatorWithText } from "@/components/ui/separator";
import { loginSchema } from "@/schemas/auth.schema";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoginUser } from "@/hooks/auth.hook";
import { useUser } from "@/context/user.provider";

type TFormData = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export default function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { setIsUserLoading } = useUser();

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect");

  const {
    mutate: loginUser,
    data: userData,
    isSuccess,
    isPending,
    isError,
    error,
  } = useLoginUser();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data: TFormData) => {
    loginUser({
      email: data.email,
      password: data.password,
    });
    setIsUserLoading(true);
  };

  useEffect(() => {
    if (!isPending && isSuccess) {
      if (redirect) {
        router.push(redirect);
      } else {
        router.push("/");
      }
    }
  }, [isPending, isSuccess, redirect, router]);

  return (
    <section className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col items-center justify-center min-h-[87vh] w-full gap-8">
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-500">
            Welcome back to ClassyShop
          </h3>
          <h1 className="text-3xl font-semibold mt-2.5 mb-4">
            Sign In your account
          </h1>
          <p className="font-medium text-gray-500">
            To use ClassyShop, Please enter your details.
          </p>
        </div>
        <div className="w-full max-w-md border rounded-lg p-6 shadow-sm">
          {isError && (
            <Alert
              variant="destructive"
              className="mb-5 border-red-500 bg-red-50"
            >
              <AlertCircleIcon />
              <AlertTitle>Unable to sing in.</AlertTitle>
              <AlertDescription>
                <p>{error?.message}</p>
              </AlertDescription>
            </Alert>
          )}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
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
                  className={`absolute  ${
                    errors.password ? "top-[42%]" : "top-[60%]"
                  } right-3 cursor-pointer text-lg`}
                >
                  {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FieldSet>
                      <Field
                        className="w-fit"
                        orientation="horizontal"
                        data-invalid={fieldState.invalid}
                      >
                        <Checkbox
                          id="remember-checkbox"
                          name={field.name}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-invalid={fieldState.invalid}
                          className="cursor-pointer"
                        />
                        <FieldLabel htmlFor={`remember-checkbox`} className="">
                          Remember Me
                        </FieldLabel>
                      </Field>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldSet>
                  )}
                />

                <div className="w-fit">
                  <Link
                    href="/forgot-password"
                    className="font-medium text-primary underline text-sm"
                  >
                    Forgot Password
                  </Link>
                </div>
              </div>
            </FieldGroup>

            <Button
              disabled={isPending}
              type="submit"
              className="w-full hover:cursor-pointer"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="flex items-center justify-center gap-2 mt-3 mb-5">
            <span className="text-sm font-medium text-gray-500">
              Don&apos;t have an account?
            </span>
            <Link
              href="/signup"
              className="font-medium text-primary text-sm hover:underline"
            >
              Sign Up
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
