const Server = require("../models/server");
const User = require("../models/user");
const Channel = require('../Models/channel')

const registerUserToServer = async (userId) => {
  try {
    const user = await User.findById(userId);
    const serverName = `${user.batch}-${user.degree_name}-${user.campus}`;
    let server = await Server.findOne({ name: serverName });

    if (!server) {
      server = new Server({
        name: serverName,
        users: [userId],
      });
      await server.save();
      const defaultChannels = [
        { name: "💬 general chat" },
        { name: "📢 announcements" },
        { name: "📚 resources" },
        { name: "🔊 voice chat" },
      ];

      for (const ch of defaultChannels) {
        const channel = new Channel({
          name: ch.name,
          owner_server: server._id,
        });
        await channel.save();
      }

      console.log(`✅ New server ${server.name} created & User added in it.`);
    } else {
      if (!server.users.includes(userId)) {
        server.users.push(userId);
        await server.save();
        console.log(`✅ User ${user.username} added to the existing server: ${server.name}`);
      } else {
        console.log(`ℹ️ User already in server: ${server.name}`);
      }
    }

    if (!user.servers.includes(server._id)) {
      user.servers.push(server._id);
      await user.save();
      console.log(`✅ Server ${server.name} added to user's server list.`);
    }
    return user;
  } catch (error) {
    console.error("❌ Error in registerUserToServer:", error.message);
  }
};

module.exports = { registerUserToServer };
