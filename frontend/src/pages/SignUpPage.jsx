import React, { useState } from "react";
import People from "../assets/signup.png";
import Google from "../assets/google.svg";

const SignUp = () => {
  const [agreed, setAgreed] = useState(false);

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

      <div className="relative w-full max-w-6xl">
        <div className="grid md:grid-cols-5">
          {/* Sign Up Card */}
          <div className="md:col-span-3 bg-white rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col relative z-10">
            <div className="flex-1 flex flex-col items-center justify-center space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-medium text-gray-700">
                  Welcome to
                </h2>
                <h1 className="text-5xl font-bold text-purple-600">NU-Cord</h1>
              </div>

              <div className="w-full max-w-md">
                <div className="h-px bg-gray-200 my-8" />

                <button className="w-full py-3 text-base font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 hover:bg-purple-600 hover:text-white rounded-md cursor-pointer">
                  <img
                    src={Google}
                    alt="Google logo"
                    className="w-6 h-6"
                  />
                  <span>Sign Up with NU mail</span>
                </button>

                <div className="flex items-center justify-center mt-4 space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="h-4 w-4 accent-purple-600"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-600 cursor-pointer">
                    Terms & Conditions
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Image (Only on md and up) */}
          <div className="md:col-span-2 hidden md:flex items-end justify-end">
            <img
              src={People}
              alt="People illustration"
              className="absolute bottom-0 right-0 md:max-h-96 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
