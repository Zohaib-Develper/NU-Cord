import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChannelPage from "../components/ChannelPage";
import PageSpecificSidebar from "../components/PageSpecificSidebar";
import { useEffect } from "react";
import axios from "axios";

const GroupsPage = () => {
  const [groupsData, setGroupsData] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState({});

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/groups", {
          withCredentials: true
        });
        console.log("GROUPS RESPONSE: ", response.data);
        if (response.data && response.data.groups) {
          setGroupsData(response.data.groups);
        } else {
          setGroupsData([]);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
        setGroupsData([]);
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
          pageName="groups"
          data={groupsData}
          setSelected={setSelectedGroup}
        />
      </div>
      <div className="flex-1 bg-[#151e2c] p-4 overflow-auto">
        <ChannelPage selectedChannel={selectedGroup} />
      </div>
    </div>
  );
};

export default GroupsPage;
