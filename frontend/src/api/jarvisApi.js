export async function sendMessage(message, mode = "offline") {
  const res = await fetch("http://localhost:5000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message,
      sessionId: "web-demo",
      project: "web",
      mode
    })
  });

  return res.json();
}
