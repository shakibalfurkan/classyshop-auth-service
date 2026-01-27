import type { UserRoles } from "../generated/prisma/enums.js";
interface IShopAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };

  formattedAddress?: string;
}

export type TRegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRoles;
  password: string;
  shopName?: string;
  shopEmail?: string;
  shopPhone?: string;
  shopAddress?: IShopAddress;
};
