import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChannelPage from "../components/ChannelPage";
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
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div>
        <Sidebar />
      </div>
      <div>
        {" "}
        <PageSpecificSidebar
          pageName="directmessages"
          data={directMessagesData}
          setSelected={setSelectedDM}
        />
      </div>
      <div>
        <ChannelPage />
      </div>
    </div>
  );
};

export default DirectMessagesPage;
