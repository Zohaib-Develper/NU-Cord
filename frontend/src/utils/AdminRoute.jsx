import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
import UnauthorizedAccess from "../pages/UnauthorizedAccess";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        if (!user) {
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }
        const token = localStorage.getItem("token");
        const config = {
          withCredentials: true,
        };
        if (token) {
          config.headers = { Authorization: `Bearer ${token}` };
        }
        const response = await axios.get("http://localhost:8000/user/verify-admin", config);
        setIsAuthorized(response.data.isAdmin);
      } catch (error) {
        console.error("Error verifying admin access:", error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };
    verifyAdminAccess();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0f1d]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7c3aed]"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <UnauthorizedAccess />;
  }

  return children;
};

export default AdminRoute;
