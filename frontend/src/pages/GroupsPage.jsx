import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import PageSpecificSidebar from "../components/PageSpecificSidebar";
import { useEffect } from "react";
import axios from "axios";

const GroupsPage = () => {
  const [groupsData, setGroupsData] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState({});

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

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="flex flex-row min-h-screen h-screen w-full">
      {/* Sidebar */}
      <div className="flex flex-col w-auto h-full">
        <Sidebar />
      </div>
      <div className="flex flex-col w-64 lg:w-80 border-r border-gray-700 bg-gray-900 h-full min-h-0">
        <PageSpecificSidebar
          pageName="groups"
          data={groupsData}
          setSelected={setSelectedGroup}
          refreshGroups={fetchGroups}
        />
      </div>
      <div className="flex-1 bg-[#151e2c] p-4 overflow-auto flex flex-col h-full min-h-0">
        {selectedGroup && Object.keys(selectedGroup).length > 0 ? (
          <Chat selectedChannel={selectedGroup} />
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-400 text-lg">
            Select a group to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupsPage;
