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
        const response = await axios.get("http://localhost:8000/api/groups"); // adjust the URL based on your backend route
        console.log("GROUPS: ", response.data);
        setGroupsData(response.data.groups);
      } catch (error) {
        console.error("Error fetching groups:", error);
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
          pageName="groups"
          data={groupsData}
          onGroupSelect={setSelectedGroup}
        />
      </div>
      <div>
        <ChannelPage />
      </div>
    </div>
  );
};

export default GroupsPage;
