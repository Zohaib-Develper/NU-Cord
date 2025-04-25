import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

import Landing from "../components/Home";

const HomePage = () => {
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div>
        <Sidebar />
      </div>

      <Landing />
    </div>
  );
};

export default HomePage;
