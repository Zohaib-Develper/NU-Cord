import React from "react";
import { useState } from "react";

const GroupsSideBar = () => {
  const dummyData = {
    servers: [
      {
        name: "Batch 22",
        textChannels: ["general", "resources", "announcements"],
        voiceChannels: ["Study Room 1", "Study Room 2"],
      },
      {
        name: "Gaming Hub",
        textChannels: ["chat", "memes"],
        voiceChannels: ["Game Night 1", "Game Night 2"],
      },
    ],
    groups: [
      {
        name: "Project Team",
        members: ["Alice", "Bob", "Charlie"],
      },
      {
        name: "Study Buddies",
        members: ["David", "Eve", "Frank"],
      },
    ],
    dms: ["Abdul Rafay", "Zohaib Musharaf", "Chaand Ali"],
  };
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Joined Groups</h2>
      {dummyData.groups.map((group, index) => (
        <div key={index} className="mb-3">
          <button
            className="w-full text-left p-2 rounded-lg hover:bg-gray-600"
            onClick={() =>
              setSelectedGroup(selectedGroup === group ? null : group)
            }
          >
            {group.name}
          </button>
          {selectedGroup === group && (
            <div className="ml-4 mt-2">
              <button
                className="w-full text-left p-2 rounded-lg hover:bg-gray-600 flex gap-3"
                onClick={() => {
                  setSelectedChannel(group.name);
                  setSelectedType("group");
                }}
              >
                <FaComments className="mt-1"></FaComments>
                Chat
              </button>
              <button
                className="w-full text-left p-2 rounded-lg hover:bg-gray-600 mt-1 flex gap-3"
                onClick={() =>
                  setSelectedGroupSection(
                    selectedGroupSection === "members" ? null : "members"
                  )
                }
              >
                <FaUserFriends className="mt-1"></FaUserFriends> Members
              </button>
              {selectedGroupSection === "members" && (
                <div className="ml-4 mt-2">
                  <h3 className="font-semibold">Members</h3>
                  {group.members.map((member, i) => (
                    <p key={i} className="ml-2 mt-2 text-gray-300 flex gap-3">
                      <FaUser className="text-sm mt-1"></FaUser>
                      {member}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GroupsSideBar;
