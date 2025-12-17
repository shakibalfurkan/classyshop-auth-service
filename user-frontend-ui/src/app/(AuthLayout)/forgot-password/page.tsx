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
import { AlertCircleIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForgotUserPassword } from "@/hooks/auth.hook";
import { forgotSchema } from "@/schemas/auth.schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import emailWithFrame from "@/assets/icons/email-with-frame.png";
import Image from "next/image";

type TFormData = {
  email: string;
};

export default function ForgotPassword() {
  const [open, setOpen] = useState(false);

  const {
    mutate: handleForgotPassword,
    data: userData,
    isSuccess,
    isPending,
    isError,
    error,
  } = useForgotUserPassword();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TFormData>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: TFormData) => {
    handleForgotPassword(data);
  };

  useEffect(() => {
    if (isSuccess) {
      setOpen(true);
    }
  }, [isSuccess]);

  return (
    <section className="max-w-7xl mx-auto p-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-140 text-center">
          <DialogHeader className="flex flex-col justify-center items-center">
            <div className="mb-4">
              <Image src={emailWithFrame} alt="email-with-frame" />
            </div>
            <DialogTitle className="text-3xl">Check your email</DialogTitle>
            <DialogDescription className="text-base font-medium">
              We've sent a verification link to {userData?.data?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <Alert>
              <AlertDescription className="p-6 text-base">
                Check your email for an verification link. Please check your
                spam folder too.
              </AlertDescription>
            </Alert>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col items-center justify-center min-h-[87vh] w-full gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mt-2.5 mb-4">
            Forgot Password
          </h1>
          <p className="font-medium text-gray-500">
            To recover your password, please enter your email address.
          </p>
        </div>
        <div className="w-full max-w-md border rounded-lg p-6 shadow-sm">
          {isError && (
            <Alert
              variant="destructive"
              className="mb-5 border-red-500 bg-red-50"
            >
              <AlertCircleIcon />
              <AlertTitle>Unable to recover password.</AlertTitle>
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
            </FieldGroup>

            <Button
              disabled={isPending}
              type="submit"
              className="w-full hover:cursor-pointer"
            >
              {isPending ? "Loading..." : "Submit"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
