import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const isAdmin = user.is_superuser || user.is_staff;

    if (allowedRoles.includes("admin")) {
      if (!isAdmin) return <Navigate to="/" replace />;
    }

    if (allowedRoles.includes("user")) {
    }
  }

  return children;
};

export default PrivateRoute;
