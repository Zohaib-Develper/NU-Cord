import React from "react";
import {
  Home,
  Users,
  Server,
  BarChart2,
  Layers,
  LogOut,
  Command,
} from "lucide-react";
import Logo from "../../assets/logo.png";
const Sidebar = ({ activeView, setActiveView, closeMobileSidebar }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { id: "users", label: "Users", icon: <Users size={20} /> },
    { id: "servers", label: "Servers", icon: <Server size={20} /> },
    { id: "groups", label: "Groups", icon: <Layers size={20} /> },
    { id: "stats", label: "Statistics", icon: <BarChart2 size={20} /> },
  ];

  const handleMenuClick = (view) => {
    setActiveView(view);
    closeMobileSidebar();
  };

  return (
    <div className="h-full flex flex-col bg-nu-dark-800 text-white shadow-lg">
      {/* Logo and Admin Title */}
      <div className="p-6 flex items-center space-x-3 border-b border-nu-dark-900">
        <div className="w-10 h-10 flex items-center justify-center rounded-lg shadow-lg">
          <img src={Logo} alt="Logo" />
        </div>
        <div>
          <h2 className="text-xl font-bold">NU-Cord</h2>
          <p className="text-xs text-[#c4b5fd]">Admin Panel</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeView === item.id
                    ? "bg-[#7c3aed] text-white shadow-md"
                    : "text-gray-300 hover:bg-[#0a0f1d]/50 hover:text-white"
                }`}>
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {activeView === item.id && (
                  <span className="ml-auto w-2 h-2 bg-[#c4b5fd] rounded-full"></span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-[#0a0f1d]">
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#0a0f1d]/50 hover:text-white transition-all duration-200">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
