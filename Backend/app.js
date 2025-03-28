require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/dbConfig.js");
const userRoutes = require("./routes/userRoutes.js");
const checkForAuthentication = require("./middleware/userMiddleware.js");
const cookieParser = require("cookie-parser");

const app = express();

//DB Connection
connectDB();

//Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Authentication Middleware
app.use(checkForAuthentication("token"));

//CORS Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

//Routes
app.get("/homepage", (req, res) => res.send("Homepage!"));
app.use("/user", userRoutes);

//Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong with middleware" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
