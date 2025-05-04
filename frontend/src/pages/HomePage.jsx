import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Landing from "../components/Home";

const HomePage = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-auto h-full">
        <Sidebar />
      </div>
      <div className="flex-1 h-full min-h-0">
        <Landing />
      </div>
    </div>
  );
};

export default HomePage;
