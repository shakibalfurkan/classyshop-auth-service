import type { UserRoles } from "../../generated/prisma/enums.js";

export interface IRegisterRequestDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRoles;
}

export interface IVerifyRegistrationDTO {
  email: string;
  otp: string;
}

export interface IResendOtpDTO {
  email: string;
}

export interface ILoginDTO {
  email: string;
  password: string;
}

export interface IRegistrationResult {
  user: {
    id: string;
    email: string;
    role: UserRoles[];
  };
  accessToken?: string;
  refreshToken?: string;
}

export interface ILoginResult {
  user: {
    id: string;
    email: string;
    role: UserRoles[];
  };
  accessToken?: string;
  refreshToken?: string;
}

export interface ITokenRefreshResult {
  accessToken: string;
  refreshToken: string;
  role: UserRoles[];
}
