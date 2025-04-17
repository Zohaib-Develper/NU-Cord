import React from "react";
import Login from "../components/Login";

const LoginPage = ({ onLogin }) => {
  return (
    <>
      <Login onLogin={onLogin} />
    </>
  );
};

export default LoginPage;
