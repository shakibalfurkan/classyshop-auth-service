import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import envConfig from "@/config/envConfig";

const baseQuery = fetchBaseQuery({
  baseUrl: envConfig.baseApi,
  credentials: "include",
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // First request
  let result = await baseQuery(args, api, extraOptions);
  if (
    result.error &&
    (result.error.status === 401 ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result.error.data as any)?.message === "jwt expired")
  ) {
    const refreshResult = await baseQuery(
      {
        url: "/auth/api/v1/refresh-token",
        method: "POST",
      },
      api,
      extraOptions
    );
    console.log(refreshResult);

    if (refreshResult.data) {
      result = await baseQuery(args, api, extraOptions);
    } else {
      // ❌ Refresh failed → logout
      // TODO: handle logout
      window.location.href = "/login";
    }
  }

  return result;
};
