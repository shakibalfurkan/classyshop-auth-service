import crypto from "crypto";
import config from "../../config/index.js";
import { BadRequestError } from "../../errors/AppError.js";
import { prisma } from "../../lib/prisma.js";
import type { TRegisterRequest } from "../../types/auth.types.js";
import { hashPassword } from "../../utils/passwordHandler.js";
import { redis } from "../../config/redis.js";

const registerRequest = async (payload: TRegisterRequest) => {
  const { email, password, role, firstName, lastName, ...profileData } =
    payload;

  const existingUser = await prisma.credential.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new BadRequestError("Email already in use", "email");
  }

  const hashedPassword = await hashPassword(
    password,
    config.bcrypt_salt_round!,
  );

  const otp = crypto.randomInt(100000, 999999).toString();

  const registrationData = {
    email,
    hashedPassword,
    role,
    firstName,
    lastName,
    profileData,
    otp,
  };

  await redis.setex(`reg:${email}`, 35 * 60, JSON.stringify(registrationData));
};

// const verifyRegistration = async (req, res) => {
//   const { email, otp } = req.body;

//   // 1. Get data from Redis
//   const cachedData = await redis.get(`reg:${email}`);
//   if (!cachedData)
//     return res
//       .status(400)
//       .json({ message: "Registration expired or not found" });

//   const data = JSON.parse(cachedData);

//   // 2. Check OTP
//   if (data.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

//   // 3. OTP is correct! Create User in DBs using Transaction logic
//   try {
//     const result = await prisma.$transaction(async (tx) => {
//       // Create Credential in Auth-Service
//       const credential = await tx.credential.create({
//         data: {
//           email: data.email,
//           password: data.hashedPassword,
//           role: data.role,
//           isVerified: true,
//         },
//       });

//       // Call User-Service via Internal API or gRPC to create profile
//       await userService.createProfile({
//         userId: credential.id,
//         role: data.role,
//         ...data.profileData,
//       });

//       return credential;
//     });

//     // 4. Cleanup Redis
//     await redis.del(`reg:${email}`);

//     // 5. Generate JWT and finish
//     const token = generateToken(result);
//     res.status(201).json({ token, user: result });
//   } catch (error) {
//     res.status(500).json({ message: "Transaction failed" });
//   }
// };

export const AuthService = {
  registerRequest,
};
