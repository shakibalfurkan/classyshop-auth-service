"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signupSchema } from "@/schemas/auth.schema";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useSignupMutation } from "@/redux/features/auth/authApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { countries } from "@/data";
import type { TCountry } from "@/types";

type TFormData = {
  name: string;
  email: string;
  phoneNumber: string;
  country: string;
  password: string;
};

export default function Signup() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const [signup, { data: sellerData, isError, isSuccess, isLoading }] =
    useSignupMutation();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      country: "",
      password: "",
    },
  });

  const onSubmit = (data: TFormData) => {
    signup({ name: data.name, email: data.email });
    sessionStorage.setItem("signupData", JSON.stringify(data));
  };

  useEffect(() => {
    if (!isLoading && isSuccess && sellerData?.success) {
      toast.success(sellerData?.message);
      navigate("/verify-otp");
    }
  }, [
    isLoading,
    navigate,
    isSuccess,
    sellerData?.message,
    sellerData?.success,
  ]);

  return (
    <section className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col items-center justify-center min-h-[87vh] w-full gap-8 ">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mt-2.5">Create your account</h1>
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
                <p>{sellerData?.message}</p>
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
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
                    <Input
                      {...field}
                      id="phoneNumber"
                      type="tel"
                      aria-invalid={fieldState.invalid}
                      placeholder="+8801XXXXXXXXX"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="country"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="country">Country</FieldLabel>
                    <Select
                      {...field}
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className="w-70"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country: TCountry) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              disabled={isLoading}
              type="submit"
              className="w-full hover:cursor-pointer"
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-sm font-medium text-gray-500">
              Already have an account?
            </span>
            <Link
              to="/login"
              className="font-medium text-primary text-sm hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
