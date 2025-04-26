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
        // console.log("GROUPS: ", response.data);
        setServersData(response.data.servers);
      } catch (error) {
        console.error("Error fetching servers:", error);
      }
    };

    fetchGroups();
  }, []);
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div>
        <Sidebar />
      </div>
      <div>
        {" "}
        <PageSpecificSidebar
          pageName="servers"
          data={serversData}
          setSelected={setSelectedChannel}
        />
      </div>
      <div className="flex-1">
        <ChannelPage selectedChannel={selectedChannel} />
      </div>
    </div>
  );
};

export default ServersPage;
