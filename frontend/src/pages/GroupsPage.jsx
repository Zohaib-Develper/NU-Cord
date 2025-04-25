import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import JoinedInfo from "../components/JoinedInfo";
import ChannelPage from "../components/ChannelPage";
import Landing from "../components/Home";
import ServersSideBar from "../components/ServersSideBar";
import PageSpecificSidebar from "../components/PageSpecificSidebar";

const GroupsPage = () => {
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div>
        <Sidebar />
      </div>
      <div>
        {" "}
        <PageSpecificSidebar pageName="groups" />
      </div>
      <div>
        <ChannelPage />
      </div>
    </div>
  );
};

export default GroupsPage;
