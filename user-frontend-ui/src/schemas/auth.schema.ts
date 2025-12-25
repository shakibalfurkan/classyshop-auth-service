import z from "zod";

export const loginSchema = z.object({
  email: z.email().nonempty("Email is required."),
  password: z
    .string()
    .nonempty("Password is required.")
    .min(8, { error: "Password must be 8 characters long" })
    .max(20, { error: "Password must be less than 20 characters" }),
  rememberMe: z.boolean().optional(),
});

export const signupSchema = z.object({
  name: z.string().nonempty("Name is required.").trim(),

  email: z.email().nonempty("Email is required."),
  password: z
    .string()
    .nonempty("Password is required.")
    .min(8, { error: "Password must be 8 characters long" })
    .max(20, { error: "Password must be less than 20 characters" })
    .trim(),
});

export const forgotSchema = z.object({
  email: z.email().nonempty("Email is required."),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .nonempty("New password is required.")
      .min(8, { error: "Password must be 8 characters long" })
      .max(20, { error: "Password must be less than 20 characters" }),

    confirmNewPassword: z
      .string()
      .nonempty("Confirm new password is required.")
      .min(8, { error: "Password must be 8 characters long" })
      .max(20, { error: "Password must be less than 20 characters" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });
