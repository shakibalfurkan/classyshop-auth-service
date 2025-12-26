import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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
