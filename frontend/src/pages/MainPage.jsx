import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import JoinedInfo from "../components/JoinedInfo";
import ChannelPage from "../components/ChannelPage";

const MainPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div>
        <Sidebar setSelectedCategory={setSelectedCategory} />
      </div>

      {/* Joined Info (Left Panel) */}
      <div className="">
        <JoinedInfo 
          selectedCategory={selectedCategory} 
          setSelectedChannel={setSelectedChannel} 
          selectedChannel={selectedChannel}
          setSelectedType={setSelectedType}  
        />
      </div>

      {/* Channel Page (Right Panel) */}
      <div className="">
        <ChannelPage selectedChannel={selectedChannel} selectedType={selectedType}/>
      </div>
    </div>
  );
};

export default MainPage;
