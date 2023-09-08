import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketComponent = () => {
  const [data, setData] = useState("");

  useEffect(() => {
    // Create a WebSocket connection to the server
    const socket = io("http://localhost:5000");

    // Listen for messages from the server
    socket.on("message", (message) => {
      console.log(`Message from server: ${message}`);
      setData(message);
    });

    // Cleanup the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <div>WebSocket Component</div>
      {data}
    </>
  );
};

export default SocketComponent;
