import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "@/components/backend/context/Auth";

const RequiereAuth = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequiereAuth;
