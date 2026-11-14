
import { useEffect, useRef, useState } from "react";

export default function ChatScreen({ name }) {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // 1. Connect to the WebSocket server
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000");
    socketRef.current = socket;

    // 2. Receive messages from the server
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    return () => socket.close();
  }, []);

  // 3. Send a message to the server
  const sendMessage = () => {
    const socket = socketRef.current;
    if (!text.trim() || socket?.readyState !== WebSocket.OPEN) return;

    const message = { sender: name, text };
    socket.send(JSON.stringify(message));
    setMessages((prev) => [...prev, message]);
    setText("");
  };

  return (
    <>
      {messages.map((m, i) => (
        <p key={i}>{m.sender}: {m.text}</p>
      ))}
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </>
  );
}
