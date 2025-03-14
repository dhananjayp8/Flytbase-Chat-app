const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  socket.on("sendMessage", (data) => {
    console.log(
      `Message from ${data.username} in room ${data.room}: ${data.message}`
    );
    // Broadcast message to everyone in the room
    io.to(data.room).emit("message", data);
  });
  socket.on("videoOffer", (data) => {
    io.to(data.room).emit("videoOffer", data);
  });

  socket.on("videoAnswer", (data) => {
    io.to(data.room).emit("videoAnswer", data);
  });

  socket.on("iceCandidate", (data) => {
    io.to(data.room).emit("iceCandidate", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
const PORT = 8000 || process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
