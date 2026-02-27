import { Navigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  // Allow admin to access all dashboards, but only redirect to their own dashboard on login
  if (allowedRoles && user) {
    if (user.role === "admin") {
      // Admin can access any route
      return <>{children}</>;
    }
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to={`/${user.role}`} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
