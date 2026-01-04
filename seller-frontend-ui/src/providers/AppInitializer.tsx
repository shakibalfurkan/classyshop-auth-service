import { Spinner } from "@/components/ui/spinner";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { clearAuth, setAuthData } from "@/redux/features/auth/authSlice";

import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useEffect } from "react";

export default function AppInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isInitialized } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const { data, isLoading, isSuccess, isError } = useGetMeQuery(undefined, {
    skip: isInitialized,
  });

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(setAuthData(data.data));
    } else if (isError) {
      dispatch(clearAuth());
    }
  }, [isSuccess, isError, data, dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Spinner className="w-12 h-12 text-primary-600" />
          <p className="mt-4 font-medium">Initializing application...</p>
        </div>
      </div>
    );
  }

  return <section>{children}</section>;
}
