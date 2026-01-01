import { useState } from "react";
import { sendMessage } from "../api/jarvisApi";
import Message from "./Message";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("offline"); // offline or online

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    console.log("[Frontend] Sending message:", input);
    console.log("[Frontend] Mode:", mode);

    try {
      const data = await sendMessage(input, mode);
      console.log("[Frontend] Response received:", data);
      
      const aiMessage = { role: "assistant", text: data.reply };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error("[Frontend] Error:", err);
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: "Error connecting to JarvisOS." }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-screen max-h-screen py-4">
      {/* Futuristic Header */}
      <div className="mb-4 text-center shrink-0">
        <h1 className="text-4xl font-bold text-jarvis-cyan text-glow-cyan tracking-wider">
          JARVIS<span className="text-white">OS</span>
        </h1>
        <p className="text-sm text-gray-400 mt-2 tracking-widest">ARTIFICIAL INTELLIGENCE INTERFACE</p>
      </div>

      {/* Glassmorphism Chat Panel */}
      <div className="glass-panel rounded-2xl p-6 shadow-2xl relative flex flex-col flex-1 min-h-0">
        {/* AI Mode Indicator - HUD Style with Toggle */}
        <div className="absolute top-4 right-4 flex items-center gap-3 z-20">
          {/* Mode Toggle Switch */}
          <button
            onClick={() => setMode(mode === "offline" ? "online" : "offline")}
            className="flex items-center gap-2 px-3 py-1.5 bg-jarvis-darker/60 border border-jarvis-cyan/40 rounded-lg backdrop-blur-sm hover:bg-jarvis-darker/80 transition-all duration-300 group"
            title={mode === "offline" ? "Switch to Online Mode (Cloud AI)" : "Switch to Offline Mode (Local AI)"}
          >
            {/* Status Indicator */}
            <div className="relative flex items-center justify-center">
              <div className={`w-2 h-2 rounded-full animate-pulse ${mode === "offline" ? "bg-jarvis-cyan" : "bg-jarvis-purple"}`}></div>
              <div className={`absolute w-2 h-2 rounded-full animate-ping ${mode === "offline" ? "bg-jarvis-cyan" : "bg-jarvis-purple"}`}></div>
            </div>
            
            {/* Mode Text */}
            <span className={`text-xs font-mono tracking-wide ${mode === "offline" ? "text-jarvis-cyan" : "text-jarvis-purple"}`}>
              {mode === "offline" ? "OFFLINE MODE" : "ONLINE MODE"}
            </span>
            
            {/* Mode Icon */}
            <span className="text-xs opacity-70">
              {mode === "offline" ? "💻" : "📡"}
            </span>
          </button>
          
          {/* Info Tooltip */}
          <div className="relative group">
            <div className="w-5 h-5 rounded-full border border-jarvis-cyan/40 flex items-center justify-center text-xs text-jarvis-cyan/60 hover:text-jarvis-cyan cursor-help">
              ?
            </div>
            <div className="absolute top-full right-0 mt-2 w-72 p-3 bg-jarvis-darker/95 border border-jarvis-cyan/30 rounded-lg text-xs text-gray-300 leading-relaxed opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none z-10">
              <div className="font-semibold text-jarvis-cyan mb-1">💻 OFFLINE MODE</div>
              <div className="mb-2">Local AI model. Private, fast, no API costs. May not have real-time information.</div>
              <div className="font-semibold text-jarvis-purple mb-1">📡 ONLINE MODE</div>
              <div>Cloud AI (Groq). More capable, general knowledge, but requires API key.</div>
            </div>
          </div>
        </div>
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto mb-4 px-2 pt-12 scrollbar-thin scrollbar-thumb-jarvis-cyan/30 scrollbar-track-transparent">
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
        <div className="flex gap-3 shrink-0">
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
