/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */

const dgram = require("dgram");
const os = require("os");

const PORT = 3000;
const requestStatusMessage = Buffer.from("M99999");
const socket = dgram.createSocket("udp4");
const BROADCAST_INTERVAL = 1000;

socket.bind(PORT, () => {
  socket.setBroadcast(true);
});

function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const k in interfaces) {
    const ipInterface = interfaces[k];
    if (ipInterface) {
      for (const k2 in ipInterface) {
        const address = ipInterface[k2];
        if (address.family === "IPv4" && !address.internal) {
          addresses.push(address.address);
        }
      }
    }
  }

  return addresses;
}

const localIPs = getLocalIPs();
console.log("Local IPs:", localIPs);

function createUDPClient() {
  setInterval(() => {
    socket.send(requestStatusMessage, PORT, "255.255.255.255", (err) => {
      if (err) {
        console.error("Error sending message:", err);
      } else {
        console.log("Requested 3D printer status");
      }
    });
  }, BROADCAST_INTERVAL);
}

function createUDPServer() {
  socket.on("listening", () => {
    const address = socket.address();
    console.log(`UDP Server listening on ${address.address}:${address.port}`);
  });

  socket.on("message", (message, remote) => {
    if (localIPs.includes(remote.address)) {
      return;
    }

    console.log("Got data from address:", remote.address);
  });

  socket.on("error", (error) => {
    console.error("Error:", error);
  });

  return socket;
}

module.exports = { getLocalIPs, createUDPClient, createUDPServer };
