import { prisma } from "../../lib/prisma.js";
import type { UserRoles } from "../../generated/prisma/enums.js";

export async function existsByEmailIncludingDeleted(
  email: string,
): Promise<boolean> {
  const count = await prisma.credential.count({
    where: { email },
  });
  return count > 0;
}

export async function findByEmail(email: string) {
  return prisma.credential.findUnique({
    where: { email },
  });
}

export async function findById(id: string) {
  return prisma.credential.findUnique({
    where: { id },
  });
}

export async function createCredential(data: {
  email: string;
  password: string;
  role: UserRoles[];
}) {
  return prisma.credential.create({
    data: {
      email: data.email,
      password: data.password,
      role: data.role,
    },
  });
}

export async function updatePassword(id: string, hashedPassword: string) {
  return prisma.credential.update({
    where: { id },
    data: { password: hashedPassword },
  });
}

export async function incrementFailedLoginAttempts(id: string) {
  return prisma.credential.update({
    where: { id },
    data: {
      failedLoginAttempts: { increment: 1 },
    },
  });
}

export async function resetFailedLoginAttempts(id: string) {
  return prisma.credential.update({
    where: { id },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });
}

export async function lockAccount(id: string, lockedUntil: Date) {
  return prisma.credential.update({
    where: { id },
    data: {
      lockedUntil,
    },
  });
}

export async function findRefreshToken(token: string) {
  return prisma.refreshToken.findUnique({
    where: { token },
    include: { credential: true },
  });
}

export async function revokeRefreshToken(token: string) {
  return prisma.refreshToken.update({
    where: { token },
    data: { isRevoked: true },
  });
}

export async function revokeTokenFamily(familyId: string) {
  return prisma.refreshToken.updateMany({
    where: { familyId },
    data: { isRevoked: true },
  });
}

export async function createPasswordReset(data: {
  credentialId: string;
  resetToken: string;
  expiresAt: Date;
}) {
  return prisma.passwordReset.create({ data });
}

export async function findPasswordResetByToken(resetToken: string) {
  return prisma.passwordReset.findUnique({
    where: { resetToken },
  });
}

export async function markPasswordResetUsed(id: string) {
  return prisma.passwordReset.update({
    where: { id },
    data: { usedAt: new Date() },
  });
}
