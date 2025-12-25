import z from "zod";

export const signupSchema = z.object({
  name: z.string().nonempty("Name is required.").trim(),

  email: z.email().nonempty("Email is required.").trim(),
  phoneNumber: z
    .e164({
      error: (issue) =>
        issue.input === undefined
          ? "Phone number is required."
          : "Phone number is invalid.",
    })
    .nonempty("Phone number is required.")
    .min(10, { error: "Phone number must be 10 characters long" })
    .max(15, {
      error: "Phone number must be less than 15 characters",
    }),
  country: z.string().nonempty("Country is required.").trim(),
  password: z
    .string()
    .nonempty("Password is required.")
    .min(8, { error: "Password must be 8 characters long" })
    .max(20, { error: "Password must be less than 20 characters" })
    .trim(),
});

export const loginSchema = z.object({
  email: z.email().nonempty("Email is required."),
  password: z
    .string()
    .nonempty("Password is required.")
    .min(8, { error: "Password must be 8 characters long" })
    .max(20, { error: "Password must be less than 20 characters" }),
  rememberMe: z.boolean().optional(),
});
