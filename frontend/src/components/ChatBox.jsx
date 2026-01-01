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
    <div className="w-full max-w-4xl mx-auto">
      {/* Futuristic Header */}
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-jarvis-cyan text-glow-cyan tracking-wider">
          JARVIS<span className="text-white">OS</span>
        </h1>
        <p className="text-sm text-gray-400 mt-2 tracking-widest">ARTIFICIAL INTELLIGENCE INTERFACE</p>
      </div>

      {/* Glassmorphism Chat Panel */}
      <div className="glass-panel rounded-2xl p-6 shadow-2xl">
        {/* Messages Container */}
        <div className="h-[500px] overflow-y-auto mb-6 px-2 scrollbar-thin scrollbar-thumb-jarvis-cyan/30 scrollbar-track-transparent">
          {messages.map((m, i) => (
            <Message key={i} role={m.role} text={m.text} />
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-jarvis-cyan animate-pulse">
              <div className="w-2 h-2 bg-jarvis-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-jarvis-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-jarvis-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              <span className="ml-2 text-sm">JARVIS is processing...</span>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="ENTER COMMAND..."
            className="flex-1 bg-jarvis-darker/80 border border-jarvis-cyan/30 rounded-xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-jarvis-cyan focus:glow-cyan transition-all duration-300"
            onKeyDown={e => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="px-8 py-3 bg-gradient-to-r from-jarvis-cyan to-jarvis-blue rounded-xl font-semibold text-jarvis-darker hover:glow-cyan transform hover:scale-105 transition-all duration-300 active:scale-95"
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}
