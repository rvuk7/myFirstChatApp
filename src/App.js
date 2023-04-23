import { v4 as uuidv4 } from "uuid";
import "./App.css";
import Messages from "./components/Messages";
import Names from "./components/Names";
import LastNames from "./components/LastNames";
import Input from "./components/Input";
import React, { useState, useEffect } from "react";

const drone = new window.Scaledrone("sUjg3Hn5Wfsef0iv");

function App() {
  const [messages, setMessages] = useState([]);
  const [member, setMember] = useState({});

  useEffect(() => {
    const room = drone.subscribe("observable-room");
    room.on("data", (data, member) => {
      const newMessage = {
        text: data.text,
        member: data.member,
        id: data.id,
        timestamp: data.timestamp,
      };
      setMessages((m) => [...m, newMessage]);
    });
    drone.on("open", (error) => {
      if (error) {
        return console.error(error);
      }
      const name = Names[Math.floor(Math.random() * Names.length)];
      const lastName = LastNames[Math.floor(Math.random() * LastNames.length)];
      const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      const randomMember = {
        username: `${name} ${lastName}`,
        color: color,
        id: drone.clientId,
      };
      setMember(randomMember);
    });
  }, []);

  const sendMessage = (message) => {
    const newMessage = {
      text: message,
      member: member,
      id: uuidv4(),
      timestamp: new Date().getTime(),
    };
    drone.publish({
      room: "observable-room",
      message: newMessage,
    });
  };

  return (
    <div className="chatApp">
      <div className="appHeader">
        <h1>- N a p k i n -</h1>
      </div>
      <Messages messages={messages} currentMember={member} />
      <Input handleMessages={sendMessage} />
    </div>
  );
}

export default App;
