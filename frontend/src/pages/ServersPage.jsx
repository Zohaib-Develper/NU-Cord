import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
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
    <div className="flex flex-col md:flex-row min-h-screen w-full h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-auto h-full">
        <Sidebar />
      </div>
      <div className="w-full md:max-w-64 lg:max-w-80 border-r border-gray-700 bg-gray-900 h-full">
        <PageSpecificSidebar
          pageName="servers"
          data={serversData}
          setSelected={setSelectedChannel}
        />
      </div>
      <div className="flex-1 bg-[#151e2c] p-4 overflow-auto flex flex-col h-full min-h-0">
        <Chat selectedChannel={selectedChannel} />
      </div>
    </div>
  );
};

export default ServersPage;
