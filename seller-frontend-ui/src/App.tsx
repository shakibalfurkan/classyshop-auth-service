import { useEffect } from "react";
import { Outlet } from "react-router";
import { useAppDispatch, useAppSelector } from "./redux/hook";
import { useGetMeQuery } from "./redux/features/auth/authApi";
import { setSeller } from "./redux/features/auth/authSlice";

export default function App() {
  const { seller, isSellerLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const {
    data: sellerData,
    isLoading: sellerLoading,
    isSuccess: isSellerSuccess,
  } = useGetMeQuery(null);

  useEffect(() => {
    if (isSellerLoading && !seller) {
      if (sellerData && isSellerSuccess && !sellerLoading) {
        dispatch(setSeller(sellerData.data ?? null));
      }
    }
  }, [
    dispatch,
    isSellerLoading,
    isSellerSuccess,
    seller,
    sellerData,
    sellerLoading,
  ]);

  console.log({ sellerData });

  return (
    <section>
      {/* TODO: Header */}
      <Outlet />
    </section>
  );
}
