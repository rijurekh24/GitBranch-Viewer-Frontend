import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const PortectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PortectedRoute;
