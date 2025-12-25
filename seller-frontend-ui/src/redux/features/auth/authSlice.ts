import { createSlice } from "@reduxjs/toolkit";

export type TSeller = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  country: string;
  password: string;
  stripeId?: string;
  createdAt: Date;
  updatedAt: Date;
};

type TAuthState = {
  seller: TSeller | null;
  isSellerLoading: boolean;
};

const initialState: TAuthState = {
  seller: null,
  isSellerLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSeller: (state, action) => {
      const seller = action.payload;
      state.seller = seller;
      state.isSellerLoading = false;
    },
    clearUser: (state) => {
      state.seller = null;
      state.isSellerLoading = false;
    },
    setIsSellerLoading: (state, action) => {
      state.isSellerLoading = action.payload;
    },
  },
});

export const { setSeller, setIsSellerLoading, clearUser } = authSlice.actions;

export default authSlice.reducer;
