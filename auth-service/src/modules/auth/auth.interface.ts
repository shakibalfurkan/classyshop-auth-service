export type TRegisterPayload = {
  name: string;
  email: string;
};

export type TUserVerificationPayload = {
  name: string;
  email: string;
  password: string;
  otp: string;
};
