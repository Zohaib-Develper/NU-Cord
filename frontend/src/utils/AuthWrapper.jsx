import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const AuthWrapper = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/user/Profile", {
        withCredentials: true, // sends cookies
      })
      .then((res) => {
        setAuthenticated(true);
        // Save user data to localStorage
        localStorage.setItem("user", JSON.stringify(res.data.user));
      })
      .catch((err) => {
        setAuthenticated(false);
        // Clear any stale user data
        localStorage.removeItem("user");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Checking authentication...</div>;

  return authenticated ? children : <Navigate to="/login" />;
};

export default AuthWrapper;
