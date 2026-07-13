import type { UserRoles } from "../../generated/prisma/enums.js";

export function buildJwtPayload(credential: {
  id: string;
  email: string;
  role: UserRoles[];
}) {
  return {
    id: credential.id,
    role: credential.role,
    email: credential.email,
  };
}
