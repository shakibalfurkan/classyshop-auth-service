import { useAppSelector } from "@/redux/hook";
import { Navigate, Outlet, useLocation } from "react-router";

const PrivateRoute = ({ children }: { children?: React.ReactNode }) => {
  const { seller, isInitialized } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isInitialized) {
    return null;
  }

  if (!seller?._id) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
export default PrivateRoute;
