import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Server,
  Building,
  Layers,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  Clock,
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServers: 0,
    totalCampuses: 0,
    totalGroups: 0,
    totalChannels: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity] = useState([
    { type: "user", action: "User suspended", time: "2 minutes ago" },
    { type: "server", action: "New server created", time: "1 hour ago" },
    { type: "group", action: "Group deleted", time: "3 hours ago" },
    { type: "user", action: "User registered", time: "5 hours ago" },
  ]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await axios.get("/api/user/stats", {
          withCredentials: true,
        });
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b5cf6]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 flex items-center justify-center">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users size={20} />}
          color="#ede9fe"
        />
        <StatCard
          title="Total Servers"
          value={stats.totalServers}
          icon={<Server size={20} />}
          color="#ede9fe"
        />
        <StatCard
          title="Total Groups"
          value={stats.totalGroups}
          icon={<Layers size={20} />}
          color="#ede9fe"
        />
        <StatCard
          title="Total Channels"
          value={stats.totalChannels}
          icon={<MessageSquare size={20} />}
          color="#ede9fe"
        />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-[#0f172a] rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300 border border-[#8b5cf6]/20">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold mt-1">
              {value != null ? value.toLocaleString() : "0"}
            </h3>
          </div>
          <div className="p-3 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] shadow-lg">
            {icon}
          </div>
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa]"></div>
    </div>
  );
};

const StatusItem = ({ label, status }) => {
  const statusConfig = {
    operational: {
      color: "text-green-400",
      bgColor: "bg-green-400",
      icon: <TrendingUp size={16} className="text-green-400" />,
    },
    degraded: {
      color: "text-yellow-400",
      bgColor: "bg-yellow-400",
      icon: <AlertTriangle size={16} className="text-yellow-400" />,
    },
    down: {
      color: "text-red-400",
      bgColor: "bg-red-400",
      icon: <AlertTriangle size={16} className="text-red-400" />,
    },
  };

  return (
    <div className="flex items-center justify-between p-3 bg-[#4c1d95]/50 rounded-lg">
      <div className="flex items-center">
        {statusConfig[status].icon}
        <span className="ml-2 font-medium">{label}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span
          className={`h-2 w-2 rounded-full ${statusConfig[status].bgColor}`}></span>
        <span className={`text-sm ${statusConfig[status].color} capitalize`}>
          {status}
        </span>
      </div>
    </div>
  );
};

export default Dashboard;
