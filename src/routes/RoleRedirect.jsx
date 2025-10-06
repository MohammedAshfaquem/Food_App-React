import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (user.is_superuser || user.is_staff) return <Navigate to="/admin/dashboard" />;
  return <Navigate to="/user-dashboard" />;
};

export default RoleRedirect;
