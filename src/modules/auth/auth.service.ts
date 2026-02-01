import { BadRequestError } from "../../errors/AppError.js";
import { prisma } from "../../lib/prisma.js";
import type { TRegisterRequest } from "../../types/auth.types.js";

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
};

export const AuthService = {
  registerRequest,
};
