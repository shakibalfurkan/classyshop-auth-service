"use client";

import * as React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
// import UserProvider from "@/context/user.provider";

const queryClient = new QueryClient();

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <UserProvider> */}
      <Toaster />
      {children}
      {/* </UserProvider> */}
    </QueryClientProvider>
  );
}
export default Providers;
