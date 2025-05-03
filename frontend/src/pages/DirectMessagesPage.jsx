import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import PageSpecificSidebar from "../components/PageSpecificSidebar";
import axios from "axios";

const DirectMessagesPage = () => {
  const [directMessagesData, setDirectMessagesData] = useState([]);
  const [selectedDM, setSelectedDM] = useState({});
  useEffect(() => {
    axios
      .get("http://localhost:8000/user/friends", { withCredentials: true })
      .then((res) => {
        console.log(res.data.friends);
        setDirectMessagesData(res.data.friends);
      })
      .catch((err) => {
        console.log("Error from backend: ", err);
      });
  }, []);
  return (
    <div className="flex flex-col md:flex-row max-h-screen w-full">
      {/* Sidebar */}
      <div className="w-full md:w-auto">
        <Sidebar />
      </div>
      <div className="w-full md:w-64 lg:w-80 border-r border-gray-700 bg-gray-900">
        <PageSpecificSidebar
          pageName="directMessages"
          data={directMessagesData}
          setSelected={setSelectedDM}
        />
      </div>
      <div className="flex-1 bg-[#151e2c] p-4 overflow-auto">
        <Chat selectedChannel={selectedDM} />
      </div>
    </div>
  );
};

export default DirectMessagesPage;
