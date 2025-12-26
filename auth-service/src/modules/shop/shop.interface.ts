import type { Types } from "mongoose";

export type TShop = {
  _id: Types.ObjectId;
  name: string;
  bio: string;
  category: string;
  avatar?: string;
  coverBanner?: string;
  address: string;
  openingHours: string;
  website?: string;
  socialLinks: {
    [key: string]: string;
  };
  ratings: number;
  reviews: Types.ObjectId[];
  sellerId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
