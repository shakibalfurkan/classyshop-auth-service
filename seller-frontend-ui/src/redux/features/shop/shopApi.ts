import { baseApi } from "@/redux/api/baseApi";

export const shopApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createShop: builder.mutation({
      query: (shopInfo) => ({
        url: "/auth/api/v1/sellers/create-shop",
        method: "POST",
        body: shopInfo,
      }),
    }),
    connectStripeAccount: builder.mutation({
      query: () => ({
        url: "/auth/api/v1/sellers/create-stripe-connection-link",
        method: "POST",
      }),
    }),
    getMyShop: builder.query({
      query: () => ({
        url: "/auth/api/v1/sellers/my-shop",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateShopMutation,
  useConnectStripeAccountMutation,
  useGetMyShopQuery,
} = shopApi;
