export async function sendMessage(message) {
  const res = await fetch("http://localhost:5000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message,
      sessionId: "web-demo",
      project: "web"
    })
  });

  return res.json();
}
