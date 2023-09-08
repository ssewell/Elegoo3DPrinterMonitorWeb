const { createUDPServer, createUDPClient } = require("./utils/udpManager.js");
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Allow all CORS
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your react app's origin
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  createUDPServer(socket); // Listen for Elegoo printer responses
  createUDPClient(); // Broadcast status requests

  socket.on("disconnect", () => {
    // TODO: Teard down the UDP server and client
    console.log("Client disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server is listening on http://localhost:5000");
});
