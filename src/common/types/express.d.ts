type TUser = {
  id: string;
  email: string;
  role: "ADMIN" | "CUSTOMER" | "VENDOR";
};

declare global {
  namespace Express {
    interface Request {
      user?: TUser;
    }
  }
}

export {};
