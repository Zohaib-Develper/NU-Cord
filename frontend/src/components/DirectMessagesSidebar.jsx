import React from "react";
import { useState } from "react";

const DirectMessagesSidebar = () => {
  const [friends, setFriends] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8000/user/friends", { withCredentials: true })
      .then((res) => {
        console.log(res.data.friends);
        setFriends(res.data.friends);
      })
      .catch((err) => {
        console.log("Error from backend: ", err);
      });
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Direct Messages</h2>
      {friends.map((dm, index) => (
        <p
          key={index}
          className="p-2 rounded-lg hover:bg-gray-600 mb-3 cursor-pointer flex gap-3"
          onClick={() => {
            setSelectedChannel(dm);
            setSelectedType("dm");
          }}
        >
          <img
            src={FriendsProfile}
            alt="User Profile"
            className="h-7 w-7 rounded-full"
          />{" "}
          {dm}
        </p>
      ))}
    </div>
  );
};

export default DirectMessagesSidebar;
