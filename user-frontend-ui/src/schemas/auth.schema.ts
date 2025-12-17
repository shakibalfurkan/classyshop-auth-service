import z from "zod";

export const loginSchema = z.object({
  email: z.email({
    error: (issue) =>
      issue.input === undefined ? "Email is required." : "Invalid email.",
  }),
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Password is required."
          : "Invalid password.",
    })
    .min(8, { error: "Password must be 8 characters long" })
    .max(20, { error: "Password must be less than 20 characters" }),
  rememberMe: z.boolean().optional(),
});

export const signupSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Name is required." : "Invalid name.",
    })
    .min(2, { error: "Name must be 2 characters long" })
    .trim(),

  email: z.email({
    error: (issue) =>
      issue.input === undefined ? "Email is required." : "Invalid email.",
  }),
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Password is required."
          : "Invalid password.",
    })
    .min(8, { error: "Password must be 8 characters long" })
    .max(20, { error: "Password must be less than 20 characters" })
    .trim(),
});

export const forgotSchema = z.object({
  email: z.email({
    error: (issue) =>
      issue.input === undefined ? "Email is required." : "Invalid email.",
  }),
});
