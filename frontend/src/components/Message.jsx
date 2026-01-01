export default function Message({ role, text }) {
  const isUser = role === "user";

  return (
    <div
      style={{
        textAlign: isUser ? "right" : "left",
        margin: "8px 0"
      }}
    >
      <span
        style={{
          display: "inline-block",
          padding: "8px 12px",
          borderRadius: "8px",
          background: isUser ? "#4f46e5" : "#e5e7eb",
          color: isUser ? "#fff" : "#000",
          maxWidth: "70%"
        }}
      >
        {text}
      </span>
    </div>
  );
}
