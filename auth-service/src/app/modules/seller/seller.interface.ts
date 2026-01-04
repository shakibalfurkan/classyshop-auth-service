export type TSeller = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  avatar: string;
  country: string;
  password: string;
  stripeAccountId: string;
  stripeOnboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
};
