import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, AlertTriangle } from "lucide-react";

const UnauthorizedAccess = () => {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    if (secondsLeft === 0) {
      navigate("/");
      return;
    }
    const timer = setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, navigate]);

  return (
    <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1e1b4b] rounded-2xl shadow-2xl p-8 text-center transform hover:scale-[1.02] transition-all duration-300">
        <div className="mb-6 flex justify-center">
          <div className="p-4 rounded-full bg-red-500/20">
            <AlertTriangle size={48} className="text-red-400" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
        
        <div className="mb-6">
          <Shield size={24} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-300">
            You do not have the required permissions to access this page.
          </p>
        </div>

        <div className="bg-[#0f172a] rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-400">
            You will be redirected to the landing page in <span className="font-bold text-red-300">{secondsLeft}</span> second{secondsLeft !== 1 ? 's' : ''}...
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedAccess; 