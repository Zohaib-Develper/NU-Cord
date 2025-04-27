import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChannelPage from "../components/ChannelPage";
import PageSpecificSidebar from "../components/PageSpecificSidebar";
import axios from "axios";

const ServersPage = () => {
  const [serversData, setServersData] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/servers", {
          withCredentials: true,
        });
        setServersData(response.data.servers);
      } catch (error) {
        console.error("Error fetching servers:", error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      {/* Sidebar */}
      <div className="w-full md:w-auto">
        <Sidebar />
      </div>
      <div className="w-full md:w-64 lg:w-80 border-r border-gray-700 bg-gray-900">
        <PageSpecificSidebar
          pageName="servers"
          data={serversData}
          setSelected={setSelectedChannel}
        />
      </div>
      <div className="flex-1 bg-[#151e2c] p-4 overflow-auto">
        <ChannelPage selectedChannel={selectedChannel} />
      </div>
    </div>
  );
};

export default ServersPage;
