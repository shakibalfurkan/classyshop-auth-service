import { baseApi } from "@/redux/api/baseApi";
import type { TSeller, TShop } from "./authSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/api/v1/sellers/register",
        method: "POST",
        body: userInfo,
      }),
    }),
    verifySeller: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/api/v1/sellers/verify",
        method: "POST",
        body: userInfo,
      }),
    }),
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/api/v1/sellers/login",
        method: "POST",
        body: userInfo,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/api/v1/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
    getMe: builder.query<
      {
        success: boolean;
        message: string;
        data: { seller: TSeller; shop: TShop | null };
      },
      void
    >({
      query: () => ({
        url: "/auth/api/v1/sellers/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useSignupMutation,
  useVerifySellerMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
} = authApi;
