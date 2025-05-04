import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
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
          withCredentials: true,
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
    <div className="flex flex-col md:flex-row min-h-screen w-full h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-auto h-full">
        <Sidebar />
      </div>
      <div className="w-full md:max-w-64 lg:max-w-80 border-r border-gray-700 bg-gray-900 h-full">
        <PageSpecificSidebar
          pageName="groups"
          data={groupsData}
          setSelected={setSelectedGroup}
        />
      </div>
      <div className="flex-1 bg-[#151e2c] p-4 overflow-auto flex flex-col h-full min-h-0">
        <Chat selectedChannel={selectedGroup} />
      </div>
    </div>
  );
};

export default GroupsPage;
