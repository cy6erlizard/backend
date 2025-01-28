// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const coinsRouter = require("./routes/coin");
const settingsRouter = require("./routes/settings");

const app = express();

// Connect to MongoDB

// Read env vars (PORT, MONGODB_URI)
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected."))
  .catch((err) => console.error("MongoDB connection error:", err));

// Create HTTP server for Socket.IO


// Setup HTTP + Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
app.set("socketio", io);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/coins", coinsRouter);
app.use("/api/settings", settingsRouter);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
