import z from "zod";
export const shopAddressValidationSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  coordinates: z
    .object({
      lat: z.number().refine((val) => val >= -90 && val <= 90, {
        message: "Latitude must be between -90 and 90",
      }),
      lng: z.number().refine((val) => val >= -180 && val <= 180, {
        message: "Longitude must be between -180 and 180",
      }),
    })
    .optional(),
  formattedAddress: z.string().optional(),
});

const registerRequestValidationSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.email().min(1, "Email is required"),
    role: z.enum(["SUPER_ADMIN", "ADMIN", "MODERATOR", "VENDOR", "CUSTOMER"]),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(20, { error: "Password must be less than 20 characters" })
      .trim(),
    shopData: z
      .object({
        shopName: z.string().min(1, "Shop name is required"),
        shopEmail: z.email(),
        shopPhone: z
          .string()
          .min(7, "Shop phone must be at least 7 digits")
          .max(15, "Shop phone must be less than 15 digits"),
        shopAddress: shopAddressValidationSchema,
      })
      .optional(),
  }),
});

export const AuthValidation = {
  registerRequestValidationSchema,
};
