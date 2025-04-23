import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import SignUp from "./pages/SignUpPage";
import Login from "./pages/LoginPage";
import AuthWrapper from "./utils/AuthWrapper";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Route for Homepage */}
        <Route
          path="/home"
          element={
            <AuthWrapper>
              {" "}
              <HomePage />
            </AuthWrapper>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
