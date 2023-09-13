import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";
import "./components/ProgressBar.css";
import { PrinterItem } from "./types/PrinterTypes";
import Printer from "./components/Printer";

const RESPONSE_ID = "f25273b12b094c5a8b9513a30ca60049"; // Id included in valid JSON response from 3D printer

function App() {
  const [data, setData] = useState<Record<string, PrinterItem>>({});

  useEffect(() => {
    // Create a WebSocket connection to the server
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.hostname;
    const socket = io(`${protocol}//${host}:5000`);

    console.log(`host: ${host}`);

    // Listen for messages from the server
    socket.on("message", (udpData: any) => {
      const udpDataJson: PrinterItem = JSON.parse(udpData);

      if (udpDataJson.Id !== RESPONSE_ID) return;

      setData((prevData) => ({
        ...prevData,
        [udpDataJson.Data.Attributes.MainboardID]: udpDataJson,
      }));
    });

    // Cleanup the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      {Object.entries(data).map(([id, value]) => (
        <Printer key={id} item={value} debug={false} />
      ))}
    </div>
  );
}

export default App;
