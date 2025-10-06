import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const isAdmin = user.is_superuser || user.is_staff;

    // If route requires admin
    if (allowedRoles.includes("admin")) {
      if (!isAdmin) return <Navigate to="/" replace />;
    }

    // If route requires regular user
    if (allowedRoles.includes("user")) {
      // Allow any authenticated user. If you want to exclude admins from user-only
      // routes, uncomment the next line:
      // if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
