import { useAppSelector } from "@/redux/hook";
import { Navigate, Outlet, useLocation } from "react-router";

const PrivateRoute = ({ children }: { children?: React.ReactNode }) => {
  const { seller, isSellerLoading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (isSellerLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2  border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Verifying authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!seller?._id) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
export default PrivateRoute;
