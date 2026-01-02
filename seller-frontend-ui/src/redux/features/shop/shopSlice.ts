import { createSlice } from "@reduxjs/toolkit";

export type TShop = {
  _id: string;
  name: string;
  bio: string;
  category: string;
  avatar: string;
  coverBanner: string;
  address: string;
  openingHours: string;
  website: string;
  socialLinks: {
    [key: string]: string;
  };
  ratings: number;
  reviews: string[];
  sellerId: string;
  createdAt: string;
  updatedAt: string;
};

type TShopState = {
  shop: TShop | null;
  isShopLoading: boolean;
};

const initialState: TShopState = {
  shop: null,
  isShopLoading: true,
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setShop: (state, action) => {
      const shop = action.payload;
      state.shop = shop;
      state.isShopLoading = false;
    },
    clearShop: (state) => {
      state.shop = null;
      state.isShopLoading = false;
    },
  },
});

export const { setShop, clearShop } = shopSlice.actions;

export default shopSlice.reducer;
