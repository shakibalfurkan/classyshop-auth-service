import { useAppSelector } from "@/redux/hook";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { seller, isSellerLoading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (isSellerLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  if (seller && seller._id) {
    return children;
  }

  return <Navigate state={location.pathname} to={"/login"}></Navigate>;
};
export default PrivateRoute;
