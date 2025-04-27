import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Assuming you have a useAuth() hook

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/home" />;
  }

  return children;
};

export default AdminRoute;
