import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

import ChannelPage from "../components/ChannelPage";
import PageSpecificSidebar from "../components/PageSpecificSidebar";

const ServersPage = () => {
  const [serversData, setServersData] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState({});

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/servers"); // adjust the URL based on your backend route
        console.log("GROUPS: ", response.data);
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
      <div>
        <ChannelPage />
      </div>
    </div>
  );
};

export default ServersPage;
