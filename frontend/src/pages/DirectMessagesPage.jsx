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
        setDirectMessagesData(res.data.friends.map(friend => ({ ...friend, type: 'direct' })));
      })
      .catch((err) => {
        console.log("Error from backend: ", err);
      });
  }, []);
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-auto">
        <Sidebar />
      </div>
      <div className="w-full md:w-64 lg:w-80 border-r border-gray-700 bg-gray-900">
        <PageSpecificSidebar
          pageName="directMessages"
          data={directMessagesData}
          setSelected={dm => setSelectedDM({ ...dm, type: 'direct' })}
        />
      </div>
      <div className="flex-1 bg-[#151e2c] p-4 overflow-auto flex flex-col h-full min-h-0">
        {selectedDM && Object.keys(selectedDM).length > 0 ? (
          <Chat selectedChannel={selectedDM} />
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-400 text-lg">
            Select a direct message to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectMessagesPage;
