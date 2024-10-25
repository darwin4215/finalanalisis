// src/views/ChatBox.js
import React, { useState } from "react";
import "./ChatBox.css";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, from: "user" }]);
      setMessage(""); // Limpiar el input
    }
  };

  return (
    <>
      <button className="chatbox-toggle" onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>

      <div className={`chatbox ${isOpen ? "open" : "closed"}`}>
        <div className="chatbox-header" onClick={() => setIsOpen(!isOpen)}>
          <h4>Chat</h4>
          <button>{isOpen ? "Close" : "Open"}</button>
        </div>
        {isOpen && (
          <div className="chatbox-body">
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index} className="message">
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="chatbox-footer">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatBox;
