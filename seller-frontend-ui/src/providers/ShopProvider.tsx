import { Spinner } from "@/components/ui/spinner";
import { useGetMyShopQuery } from "@/redux/features/shop/shopApi";
import { setShop } from "@/redux/features/shop/shopSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useEffect } from "react";

export default function ShopProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { shop, isShopLoading } = useAppSelector((state) => state.shop);
  const dispatch = useAppDispatch();

  console.log(shop);

  const {
    data: shopData,
    isLoading: shopLoading,
    isSuccess: isShopSuccess,
  } = useGetMyShopQuery(null);

  useEffect(() => {
    if (shopData && isShopSuccess && !shopLoading) {
      dispatch(setShop(shopData.data ?? null));
    }
  }, [dispatch, isShopLoading, isShopSuccess, shop, shopData, shopLoading]);

  if (isShopLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <Spinner className="size-10" />
          <p className="font-medium">Shop Loading...</p>
        </div>
      </div>
    );
  }

  return <section>{children}</section>;
}
