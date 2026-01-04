import { useAppSelector } from "@/redux/hook";
import { Navigate, Outlet, useLocation } from "react-router";

export default function ShopRoute({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { shop, seller, isInitialized } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isInitialized) {
    return null;
  }

  if (!shop?._id) {
    return <Navigate to="/create-shop" state={{ from: location }} replace />;
  }

  if (!seller?.stripeAccountId || !seller?.stripeOnboardingComplete) {
    return <Navigate to="/stripe-connect" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
