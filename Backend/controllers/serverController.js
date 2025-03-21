const { registerUserToServer } = require("../services/serverService");

const registerUserToServerController = async (req, res) => {
  try {
    const { _id, batch, major, campus } = req.body;

    if (!_id || !batch || !major || !campus)
      return res.status(400).json({ error: "Missing required fields" });

    await registerUserToServer(_id, batch, major, campus);

    return res
      .status(200)
      .json({ message: "User registered to server successfully" });
  } catch (error) {
    console.error("Error in registerUserToServerController:", error);
  }
};

module.exports = { registerUserToServerController };
