import { useState } from "react";
import { sendMessage } from "../api/jarvisApi";
import Message from "./Message";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const data = await sendMessage(input);
      const aiMessage = { role: "assistant", text: data.reply };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: "Error connecting to JarvisOS." }
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h2>JarvisOS Web Client</h2>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          height: "400px",
          overflowY: "auto",
          marginBottom: "12px"
        }}
      >
        {messages.map((m, i) => (
          <Message key={i} role={m.role} text={m.text} />
        ))}

        {loading && <p>Jarvis is thinking...</p>}
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: "8px" }}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
