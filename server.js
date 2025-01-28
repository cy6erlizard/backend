// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const coinsRouter = require("./routes/coin");

const app = express();
const PORT = 5000;

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/shillDB")
  .then(() => console.log("MongoDB connected."))
  .catch((err) => console.error("MongoDB connection error:", err));

// Create HTTP + Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
app.set("socketio", io);

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/coins", coinsRouter);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
