export type TSeller = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  country: string;
  password: string;
  stripeAccountId?: string;
  createdAt: Date;
  updatedAt: Date;
};
