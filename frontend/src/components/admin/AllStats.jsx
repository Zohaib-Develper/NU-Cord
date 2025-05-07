import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Users, Server, Building, Layers, MessageSquare,
  TrendingUp, BarChart2, Activity, ArrowUp, ArrowDown
} from "lucide-react";

function AllStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServers: 0,
    totalCampuses: 0,
    totalGroups: 0,
    totalChannels: 0,
  });
  const [loading, setLoading] = useState(true);
  const [trends] = useState({
    users: { value: 12.5, up: true },
    servers: { value: 5.3, up: true },
    campuses: { value: 0, up: false },
    groups: { value: 8.7, up: true },
    channels: { value: 3.2, up: false },
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await axios.get("http://localhost:8000/user/stats", {
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overall Platform Analytics */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 shadow-lg backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Activity size={20} className="mr-2 text-blue-400" />
          Platform Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatOverviewCard 
            title="Total Users" 
            value={stats.totalUsers}
            icon={<Users size={20} />}
            trendValue={trends.users.value}
            trendUp={trends.users.up}
            color="blue"
          />
          <StatOverviewCard 
            title="Total Servers" 
            value={stats.totalServers}
            icon={<Server size={20} />}
            trendValue={trends.servers.value}
            trendUp={trends.servers.up}
            color="green"
          />
          <StatOverviewCard 
            title="Total Channels"
            value={stats.totalChannels}
            icon={<MessageSquare size={20} />}
            trendValue={trends.channels.value}
            trendUp={trends.channels.up}
            color="orange"
          />
        </div>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={<Users size={24} />}
          description="Registered platform users"
          color="blue"
        />
        
        <StatCard
          title="Total Servers"
          value={stats.totalServers.toLocaleString()}
          icon={<Server size={24} />}
          description="Active communication servers"
          color="green"
        />
        
        <StatCard
          title="Total Campuses"
          value={stats.totalCampuses.toLocaleString()}
          icon={<Building size={24} />}
          description="Educational campuses"
          color="purple"
        />
        
        <StatCard
          title="Total Groups"
          value={stats.totalGroups.toLocaleString()}
          icon={<Layers size={24} />}
          description="User collaboration groups"
          color="yellow"
        />
        
        <StatCard
          title="Total Channels"
          value={stats.totalChannels.toLocaleString()}
          icon={<MessageSquare size={24} />}
          description="Communication channels"
          color="red"
        />
        
        <StatCard
          title="User / Server Ratio"
          value={(stats.totalUsers / Math.max(stats.totalServers, 1)).toFixed(1)}
          icon={<BarChart2 size={24} />}
          description="Average users per server"
          color="indigo"
        />
      </div>

      {/* Charts Placeholder */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <TrendingUp size={20} className="mr-2 text-green-400" />
          Usage Analytics
        </h3>
        <p className="text-gray-400 text-sm mb-8">The graph below shows platform usage trends over time.</p>
        
        {/* Placeholder for charts - in a real app, you'd integrate an actual chart library */}
        <div className="h-64 bg-gray-750 rounded-lg flex items-center justify-center border border-gray-700">
          <div className="text-center">
            <Activity size={48} className="mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400">Analytics data visualization would appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatOverviewCard = ({ title, value, icon, trendValue, trendUp, color }) => {
  const colorClasses = {
    blue: "from-blue-600/20 to-blue-400/10 border-blue-500/30",
    green: "from-green-600/20 to-green-400/10 border-green-500/30",
    purple: "from-purple-600/20 to-purple-400/10 border-purple-500/30",
    orange: "from-orange-600/20 to-orange-400/10 border-orange-500/30",
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg border p-4 backdrop-blur-sm`}>
      <div className="flex justify-between items-start">
        <div className="text-2xl font-bold mb-1">{value.toLocaleString()}</div>
        <div className="p-2 rounded-full bg-gray-800/60">{icon}</div>
      </div>
      <div className="text-sm text-gray-400 mb-2">{title}</div>
      <div className={`flex items-center text-xs ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
        {trendUp ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
        <span className="ml-1">{trendValue}% from last month</span>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, description, color }) => {
  const colorConfig = {
    blue: {
      bgGradient: "from-blue-600 to-blue-400",
      lightBg: "bg-blue-400/10",
      border: "border-blue-500/20",
    },
    green: {
      bgGradient: "from-green-600 to-green-400",
      lightBg: "bg-green-400/10",
      border: "border-green-500/20",
    },
    purple: {
      bgGradient: "from-purple-600 to-purple-400",
      lightBg: "bg-purple-400/10",
      border: "border-purple-500/20",
    },
    yellow: {
      bgGradient: "from-yellow-600 to-yellow-400",
      lightBg: "bg-yellow-400/10",
      border: "border-yellow-500/20",
    },
    red: {
      bgGradient: "from-red-600 to-red-400",
      lightBg: "bg-red-400/10",
      border: "border-red-500/20",
    },
    indigo: {
      bgGradient: "from-indigo-600 to-indigo-400",
      lightBg: "bg-indigo-400/10",
      border: "border-indigo-500/20",
    },
  };

  return (
    <div className={`bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 ${colorConfig[color].border} border`}>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-300">{title}</h3>
          <div className={`p-2 rounded-full bg-gradient-to-br ${colorConfig[color].bgGradient}`}>
            {icon}
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-semibold">{value}</div>
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>
      </div>
      <div className={`h-1 ${colorConfig[color].lightBg}`}></div>
    </div>
  );
};

export default AllStats;