import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "@/components/backend/context/Auth";

const RequiereAuth = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return null;
  if (!isAuthenticated)
    return <Navigate to="/admin/login" state={{ from: location }} replace />;

  return children ? children : <Outlet />;
};

export default RequiereAuth;
