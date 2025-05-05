// components/PrivateRoute.jsx
import { Navigate, useLocation } from "react-router";
import { isAuthenticated } from "../utils/auth";

const PrivateRoute = ({ children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
