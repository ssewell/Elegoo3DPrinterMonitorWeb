const {
  createUDPServer,
  createUDPClient,
  getLocalIPs,
} = require("./utils/udpManager.js");
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const serverHostname = process.env.ELEGOO_MONITOR_SERVER_HOSTNAME;
console.log("Server Hostname: ", serverHostname);

// Allow all CORS
app.use(cors());

const localIPs = getLocalIPs();

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      ...localIPs.map((ip) => `http://${ip}:3000`),
      ...(serverHostname ? [serverHostname] : []),
    ],
    methods: ["GET", "POST"],
  },
});

const udpServer = createUDPServer();
createUDPClient();

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

udpServer.on("message", (message, remote) => {
  if (localIPs.includes(remote.address)) {
    return;
  }
  // Broadcast the message to all WebSocket clients
  io.emit("message", message.toString());
});

server.listen(5000, () => {
  console.log("Websocket server is listening on http://0.0.0.0:5000");
});
