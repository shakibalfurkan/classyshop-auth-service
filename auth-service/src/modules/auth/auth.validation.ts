import z, { email } from "zod";

const userRegistrationSchema = z.object({
  body: z.object({
    name: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Name is required"
            : "Name must be a string",
      })
      .min(3, { error: "Name must be 3 characters long" })
      .trim(),
    email: z
      .email({
        error: (issue) =>
          issue.input === undefined
            ? "Email is required"
            : "Invalid email address",
      })
      .trim(),
  }),
});
const userVerificationSchema = z.object({
  body: z.object({
    name: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Name is required"
            : "Name must be a string",
      })
      .min(3, { error: "Name must be 3 characters long" })
      .trim(),
    email: z
      .email({
        error: (issue) =>
          issue.input === undefined
            ? "Email is required"
            : "Invalid email address",
      })
      .trim(),
    password: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Password is required"
            : "Password must be a string",
      })
      .min(8, { error: "Password must be 8 characters long" })
      .max(20, { error: "Password must be less than 20 characters" })
      .trim(),
  }),
});

const userLoginSchema = z.object({
  body: z.object({
    email: z
      .email({
        error: (issue) =>
          issue.input === undefined
            ? "Email is required"
            : "Invalid email address",
      })
      .trim(),
    password: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Password is required"
            : "Password must be a string",
      })
      .min(8, { error: "Password must be 8 characters long" })
      .max(20, { error: "Password must be less than 20 characters" })
      .trim(),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .email({
        error: (issue) =>
          issue.input === undefined
            ? "Email is required"
            : "Invalid email address",
      })
      .trim(),
  }),
});

const resetUserPasswordSchema = z.object({
  body: z.object({
    newPassword: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "New Password is required"
            : "New Password must be a string",
      })
      .trim(),
    token: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Token is required"
            : "Token must be a string",
      })
      .trim(),
  }),
});

const changeUserPasswordSchema = z.object({
  body: z.object({
    email: z
      .email({
        error: (issue) =>
          issue.input === undefined
            ? "Email is required"
            : "Invalid email address",
      })
      .trim(),
    newPassword: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "New Password is required"
            : "New Password must be a string",
      })
      .trim(),
  }),
});

export const AuthValidation = {
  userRegistrationSchema,
  userVerificationSchema,
  userLoginSchema,
  forgotPasswordSchema,
  resetUserPasswordSchema,
  changeUserPasswordSchema,
};
