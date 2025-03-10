const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
dotenv.config();

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const users = {};
const videoStates = {};

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);
  socket.on("join", (username) => {
    users[socket.id] = username;
    console.log(`{username} joined`);
    socket.broadcast.emit("user-joined", username);
  });

  socket.on("chat-message", (message) => {
    console.log("Message received", message);
    socket.broadcast.emit("chat-message", { user: users[socket.id], message });
  });

  socket.on("toggle-video", (status) => {
    videoStates[socket.id] = status;
    socket.broadcast.emit("video-status", { user: users[socket.id], status });
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];
    delete users[socket.id];
    delete videoStates[socket.id];
    console.log(`${username} disconnected.`);
    socket.broadcast.emit("user-left", username);
  });
});

app.get("/", (req, res) => {
  res.send("Server is running");
});
app.listen(8000, () => {
  console.log("Server is running!");
});
