const Server = require("../models/server");
const Batch = require("../models/batch");
const Major = require("../models/major");
const Campus = require("../models/campus");
const User = require("../models/user");

const registerUserToServer = async (userId, batchId, majorId, campusId) => {
  try {
    const batch = await Batch.findById(batchId);
    const major = await Major.findById(majorId);
    const campus = await Campus.findById(campusId);

    if (!batch || !major || !campus) {
      throw new Error("Batch, Major, or Campus not found.");
    }

    const serverID = `${batch.year}-${major.name}-${campus.name}`;
    let server = await Server.findOne({ serverID });

    if (!server) {
      server = new Server({
        serverID,
        name: serverID,
        users: [userId],
      });
      await server.save();
      console.log(`✅ New server ${server.name} created & User added in it.`);
    } else {
      if (!server.users.includes(userId)) {
        server.users.push(userId);
        await server.save();
        console.log(`✅ User ${userId} added to the server: ${server.name}`);
      } else {
        console.log(`ℹ️ User already in server: ${server.name}`);
      }
    }

    const user = await User.findById(userId);
    if (user) {
      if (!user.servers.includes(server._id)) {
        user.servers.push(server._id);
        await user.save();
        console.log(`✅ Server ${server.name} added to user's server list.`);
        return user;
      }
    } else {
      console.warn(`⚠️ User with ID ${userId} not found.`);
    }
  } catch (error) {
    console.error("❌ Error in registerUserToServer:", error.message);
  }
};

module.exports = { registerUserToServer };
