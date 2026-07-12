import { prisma } from "../../lib/prisma.js";

export async function existsByEmailIncludingDeleted(
  email: string,
): Promise<boolean> {
  const count = await prisma.credential.count({
    where: { email },
  });
  return count > 0;
}
