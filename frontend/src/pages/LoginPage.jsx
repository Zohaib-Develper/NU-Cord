import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faEnvelope,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import Login from "../assets/signin.png";
import Google from "../assets/google.svg";
import { useNavigate, Link } from "react-router-dom";
const LoginPage = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    onLogin();
    navigate("/home");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-800 p-4 relative overflow-hidden">
      {/* Falling Stars Animation */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(100)].map((_, i) => (
          <span
            key={i}
            className="absolute w-0.5 h-2 bg-white opacity-80 rounded animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * -100}px`,
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      <div className="w-full max-w-[1200px] grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left side - Illustration */}
        <div className="hidden md:block">
          <img
            src={Login}
            alt="Login illustration"
            className="w-full max-w-lg mx-auto"
          />
        </div>

        {/* Right side - Login Form */}
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full mx-auto relative z-10">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome to
            </h1>
            <h2 className="text-5xl font-bold text-[#6C3CE9]">NU-Cord</h2>
          </div>

          {/* Google Login Button */}
          <button className="w-full mb-4 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 px-4 text-gray-700 hover:bg-purple-600 hover:text-white transition-colors cursor-pointer">
            <img src={Google} alt="Google" className="w-5 h-5" />
            <span>Login with NU mail</span>
          </button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="h-5 w-5 text-gray-400"
                    />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@nu.edu.pk"
                    className="block w-full pl-10 pr-3 py-3 bg-gray-100 border-transparent rounded-lg focus:border-[#6C3CE9] focus:ring-[#6C3CE9] focus:outline-none"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon
                      icon={faKey}
                      className="h-5 w-5 text-gray-400"
                    />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 bg-gray-100 border-transparent rounded-lg focus:border-[#6C3CE9] focus:ring-[#6C3CE9] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      className="h-5 w-5 text-purple-600"
                    />
                  </button>
                </div>
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 accent-purple-600"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm text-[#6C3CE9] hover:text-[#5731ba]">
                  Forgot Password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-[#6C3CE9] text-white rounded-lg py-3 px-4 hover:bg-[#5731ba] transition-colors">
                Login
              </button>
            </div>
          </form>

          {/* Register Link */}
          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{" "}
            <Link href="#" className="text-[#6C3CE9] hover:text-[#5731ba]" to="/signup">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
