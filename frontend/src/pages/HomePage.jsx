import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Landing from "../components/Home";

const HomePage = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      {/* Sidebar */}
      <div className="w-full md:w-auto">
        <Sidebar />
      </div>

      <div className="flex-1">
        <Landing />
      </div>
    </div>
  );
};

export default HomePage;
