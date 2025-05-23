import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Server,
  Building,
  Layers,
  MessageSquare,
  AlertCircle,
  RefreshCw,
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
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:8000/user/stats", {
        withCredentials: true,
      });
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Failed to load dashboard statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 40000); // Refresh every 40 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b5cf6]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="flex items-center text-red-400">
          <AlertCircle size={24} className="mr-2" />
          <span>{error}</span>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center px-4 py-2 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors"
        >
          <RefreshCw size={16} className="mr-2" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
          title="Total Campuses"
          value={stats.totalCampuses}
          icon={<Building size={20} />}
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

export default Dashboard;
