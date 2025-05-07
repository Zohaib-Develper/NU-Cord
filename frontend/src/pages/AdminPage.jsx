import React, { useState } from "react";
import { Menu, Activity, Users, Server, Layers, BarChart2 } from "lucide-react";
import Sidebar from "../components/admin/Sidebar";
import AllUsers from "../components/admin/AllUsers";
import AllServers from "../components/admin/AllServers";
import AllStats from "../components/admin/AllStats";
import AllGroups from "../components/admin/AllGroups";
import Dashboard from "../components/admin/Dashboard";

const AdminPage = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-[#0a0f1d] text-white">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#0f172a] shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#7c3aed] rounded-full flex items-center justify-center">
            <Activity size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold">NU-Cord Admin</h1>
        </div>
        <button
          onClick={toggleMobileSidebar}
        className="p-2 rounded-lg bg-[#0f172a] hover:bg-[#4c1d95] transition-colors duration-200"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`${
            isMobileSidebarOpen ? "block" : "hidden"
          } lg:block fixed lg:static z-30 top-0 left-0 h-full w-64 bg-[#0f172a] shadow-lg transition-all duration-300 ease-in-out`}
        >
          <Sidebar 
            activeView={activeView} 
            setActiveView={setActiveView} 
            closeMobileSidebar={() => setIsMobileSidebarOpen(false)}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-10 p-4 lg:p-8 overflow-y-auto">
          {/* Content Header */}
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">
              {activeView === "dashboard" && "Dashboard Overview"}
              {activeView === "users" && "User Management"}
              {activeView === "servers" && "Server Management"}
              {activeView === "groups" && "Group Management"}
              {activeView === "stats" && "Platform Statistics"}
            </h1>
            <p className="text-gray-400 text-sm lg:text-base">
              {activeView === "dashboard" && "Welcome to your NU-Cord admin control panel"}
              {activeView === "users" && "Manage user accounts and permissions"}
              {activeView === "servers" && "View and manage all servers in the system"}
              {activeView === "groups" && "Manage user groups and their members"}
              {activeView === "stats" && "Comprehensive platform statistics and metrics"}
            </p>
          </div>

          {/* Content Area */}
          <div className="bg-[#0f172a]/50 backdrop-blur-sm rounded-xl shadow-xl p-4 lg:p-6">
            {activeView === "dashboard" && <Dashboard />}
            {activeView === "users" && <AllUsers />}
            {activeView === "servers" && <AllServers />}
            {activeView === "groups" && <AllGroups />}
            {activeView === "stats" && <AllStats />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;