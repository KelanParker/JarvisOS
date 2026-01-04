import { useRef, useState } from "react";
import { sendMessage } from "../api/jarvisApi";
import HandTracker from "../gesture/HandTracker";
import { GESTURES } from "../gesture/gestureConstants";
import { detectGesture, gestureCommandMap } from "../gesture/useHandGestures";
import { getStableGesture } from "../gesture/gestureStability";
import ParticleCanvas from "../visual/ParticleCanvas";
import Message from "./Message";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("offline"); // offline or online
  const [particleState, setParticleState] = useState("idle");
  const [gestureAvailable, setGestureAvailable] = useState(true);
  const [gestureToast, setGestureToast] = useState("");
  const lastGestureRef = useRef({ gesture: null, ts: 0 });
  const cooldownRef = useRef(0);
  const handMissingTimeoutRef = useRef(null);

  const sendToJarvis = async (messageText, targetMode, { fromGesture = false } = {}) => {
    if (!messageText?.trim()) return;

    const userMessage = { role: "user", text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    console.log("[Frontend] Sending message:", messageText);
    console.log("[Frontend] Mode:", targetMode);

    try {
      const data = await sendMessage(messageText, targetMode);
      console.log("[Frontend] Response received:", data);

      const aiMessage = { role: "assistant", text: data.reply };
      setMessages(prev => [...prev, aiMessage]);
      if (fromGesture) {
        setParticleState("executed");
        setTimeout(() => setParticleState("idle"), 800);
      }
    } catch (err) {
      console.error("[Frontend] Error:", err);
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: "Error connecting to JarvisOS." }
      ]);
      if (fromGesture) {
        setParticleState("error");
        setTimeout(() => setParticleState("idle"), 1200);
      }
    }

    setLoading(false);
  };

  const handleSend = async () => {
    const currentInput = input;
    setInput("");
    await sendToJarvis(currentInput, mode);
  };

  const canTrigger = () => {
    const now = Date.now();
    if (now - cooldownRef.current > 1200) {
      cooldownRef.current = now;
      return true;
    }
    return false;
  };

  const handleGesture = landmarks => {
    if (!gestureAvailable) return;

    const rawGesture = detectGesture(landmarks);
    const stableGesture = getStableGesture(rawGesture);
    if (!stableGesture) {
      if (rawGesture) setParticleState("stable");
      return;
    }

    const command = gestureCommandMap[stableGesture];
    if (!command || !canTrigger()) return;

    const now = Date.now();
    lastGestureRef.current = { gesture: stableGesture, ts: now };
    setParticleState("gesture");
    sendToJarvis(command, "gesture", { fromGesture: true });
  };

  const handleLandmarks = landmarks => {
    setParticleState(prev => (prev === "idle" ? "detected" : prev));
  };

  const handleHandPresenceChange = hasHand => {
    if (!hasHand) {
      setParticleState("idle");
      if (handMissingTimeoutRef.current) clearTimeout(handMissingTimeoutRef.current);
      handMissingTimeoutRef.current = setTimeout(() => {
        setGestureAvailable(false);
        setGestureToast("Gesture control unavailable (no hand detected)");
      }, 2500);
      return;
    }

    if (handMissingTimeoutRef.current) clearTimeout(handMissingTimeoutRef.current);
    setGestureAvailable(true);
    setGestureToast("");
    if (!hasHand) {
      setParticleState("idle");
      return;
    }
    setParticleState(prev => (prev === "idle" ? "detected" : prev));
  };

  const handleGestureError = err => {
    console.error("[Frontend] Gesture error:", err);
    setGestureAvailable(false);
    setGestureToast("Gesture control unavailable (camera access)");
    setParticleState("error");
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-screen max-h-screen py-4 relative">
      <ParticleCanvas state={particleState} />
      <HandTracker
        onGesture={handleGesture}
        onLandmarks={handleLandmarks}
        onHandPresenceChange={handleHandPresenceChange}
        onError={handleGestureError}
      />
      {gestureToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600/80 text-white text-xs px-3 py-2 rounded shadow-lg z-30">
          {gestureToast}
        </div>
      )}
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
