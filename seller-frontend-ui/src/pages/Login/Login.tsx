import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/auth.schema";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hook";
import { setAuthData } from "@/redux/features/auth/authSlice";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

type TFormData = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

type TErrorResponse = {
  message: string;
};

export default function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [login, { data, isError, isSuccess, isLoading, error }] =
    useLoginMutation();

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
    login({ email: data.email, password: data.password });
  };

  console.log(data);

  useEffect(() => {
    if (isSuccess && data?.success) {
      dispatch(setAuthData(data.data));
      const { shop, seller } = data.data;

      toast.success(data.message || "Login successful!");

      if (!shop) {
        navigate("/create-shop", { replace: true });
      } else if (!seller.stripeAccountId || !seller.stripeOnboardingComplete) {
        navigate("/stripe-connect", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [isSuccess, data, dispatch, navigate]);

  useEffect(() => {
    if (isError && error) {
      const errorMessage =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any)?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    }
  }, [isError, error]);

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
            <Alert variant="destructive" className="mb-5 border-red-500">
              <AlertCircleIcon />
              <AlertTitle>Unable to sing in.</AlertTitle>
              <AlertDescription>
                <p>
                  {error &&
                    "data" in error &&
                    (error.data as TErrorResponse)?.message}
                </p>
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
                    to="/forgot-password"
                    className="font-medium text-primary underline text-sm"
                  >
                    Forgot Password
                  </Link>
                </div>
              </div>
            </FieldGroup>

            <Button
              disabled={isLoading}
              type="submit"
              className="w-full hover:cursor-pointer"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-sm font-medium text-gray-500">
              Don&apos;t have an account?
            </span>
            <Link
              to="/signup"
              className="font-medium text-primary text-sm hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
