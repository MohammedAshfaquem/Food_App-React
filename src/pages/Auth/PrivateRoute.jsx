// Components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // If not logged in, redirect to login
  if (!user) return <Navigate to="/login" />;

  // If specific roles are required and user's role is not in them
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />; // redirect to RoleRedirect route
  }

  // Access allowed
  return children;
};

export default PrivateRoute;
