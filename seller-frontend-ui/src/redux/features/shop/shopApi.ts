import { baseApi } from "@/redux/api/baseApi";

export const shopApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createShop: builder.mutation({
      query: (shopInfo) => ({
        url: "/shop/api/v1/seller/create-shop",
        method: "POST",
        body: shopInfo,
      }),
    }),
  }),
});

export const { useCreateShopMutation } = shopApi;
