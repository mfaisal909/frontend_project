import { createElement } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return createElement(Navigate, { to: "/login", replace: true });
  }

  return children;
};

export default ProtectedRoute;