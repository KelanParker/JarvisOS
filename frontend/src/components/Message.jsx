export default function Message({ role, text }) {
  const isUser = role === "user";

  return (
    <div
      className={`flex mb-4 animate-slide-up ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div className={`flex items-start gap-3 max-w-[75%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar/Icon */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
            isUser
              ? "bg-gradient-to-br from-jarvis-cyan to-jarvis-blue glow-cyan"
              : "bg-gradient-to-br from-jarvis-purple to-jarvis-blue border border-jarvis-purple/50"
          }`}
        >
          {isUser ? "U" : "J"}
        </div>

        {/* Message Bubble */}
        <div
          className={`px-5 py-3 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
            isUser
              ? "bg-gradient-to-br from-jarvis-cyan/20 to-jarvis-blue/20 border border-jarvis-cyan/40 text-white"
              : "bg-jarvis-darker/60 border border-jarvis-purple/30 text-gray-100"
          }`}
        >
          <p className="text-sm leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}
