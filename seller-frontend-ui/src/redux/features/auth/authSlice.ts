import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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
  reviews: string;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface LoginResponse {
  seller: TSeller;
  shop: TShop | null;
}

type TAuthState = {
  seller: TSeller | null;
  shop: TShop | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
};

const initialState: TAuthState = {
  seller: null,
  shop: null,
  isAuthenticated: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<LoginResponse>) => {
      state.seller = action.payload.seller;
      state.shop = action.payload.shop;
      state.isAuthenticated = true;
      state.isInitialized = true;
    },
    clearAuth: (state) => {
      state.seller = null;
      state.shop = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
    },
    updateShop: (state, action: PayloadAction<TShop>) => {
      state.shop = action.payload;
    },
  },
});

export const { setAuthData, clearAuth, updateShop } = authSlice.actions;

export default authSlice.reducer;
