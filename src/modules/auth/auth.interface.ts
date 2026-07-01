import type { UserRoles } from "../../generated/prisma/enums.js";

export interface IRegistrationResult {
  user: {
    id: string;
    email: string;
    role: UserRoles;
  };
  accessToken?: string;
  refreshToken?: string;
}

export interface ILoginResult {
  user: {
    id: string;
    email: string;
    role: UserRoles;
  };
  accessToken?: string;
  refreshToken?: string;
}

export interface ITokenRefreshResult {
  accessToken: string;
  refreshToken: string;
}
