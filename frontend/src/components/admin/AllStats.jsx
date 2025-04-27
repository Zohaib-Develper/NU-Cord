import { useEffect, useState } from "react";
import axios from "axios";

function AllStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServers: 0,
    totalCampuses: 0,
    totalGroups: 0,
    totalChannels: 0,
  });
  const [loading, setLoading] = useState(true);

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
      <div className="flex items-center justify-center h-64 bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Users Card */}
          <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-4 sm:p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-600 rounded-md p-2">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <dt className="text-sm font-medium text-gray-400 truncate">
                    Total Users
                  </dt>
                  <dd className="text-xl font-semibold text-white">
                    {stats.totalUsers.toLocaleString()}
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {/* Servers Card */}
          <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-4 sm:p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-600 rounded-md p-2">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <dt className="text-sm font-medium text-gray-400 truncate">
                    Total Servers
                  </dt>
                  <dd className="text-xl font-semibold text-white">
                    {stats.totalServers.toLocaleString()}
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {/* Campuses Card */}
          <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-4 sm:p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-600 rounded-md p-2">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <dt className="text-sm font-medium text-gray-400 truncate">
                    Total Campuses
                  </dt>
                  <dd className="text-xl font-semibold text-white">
                    {stats.totalCampuses.toLocaleString()}
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {/* Groups Card */}
          <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-4 sm:p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-600 rounded-md p-2">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <dt className="text-sm font-medium text-gray-400 truncate">
                    Total Groups
                  </dt>
                  <dd className="text-xl font-semibold text-white">
                    {stats.totalGroups.toLocaleString()}
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {/* Channels Card */}
          <div className="bg-gray-800 overflow-hidden shadow rounded-lg md:col-span-2">
            <div className="px-4 py-4 sm:p-5">
              <div className="flex items-center justify-center">
                <div className="flex-shrink-0 bg-red-600 rounded-md p-2">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <dt className="text-sm font-medium text-gray-400 truncate">
                    Total Channels
                  </dt>
                  <dd className="text-xl font-semibold text-white">
                    {stats.totalChannels.toLocaleString()}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllStats;
