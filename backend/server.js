import express from "express";
import cors from "cors";
import { runJarvis } from "../jarvis-core/jarvisEngine.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const ollamaResponse = await fetch(
      "http://localhost:11434/api/generate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "huihui_ai/dolphin3-abliterated:8b",
          prompt: message,
          stream: false
        })
      }
    );

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      console.error("Ollama API error:", errorText);
      return res.status(500).json({ error: "Ollama API error" });
    }

    const data = await ollamaResponse.json();

    const decision = await runJarvis(message);

        // Later this will choose tools, intents, etc.
        console.log("Jarvis decision:", decision.type);



    res.json({
      reply: data.response
    });

  } catch (err) {
    console.error("Ollama connection failed:", err);
    res.status(500).json({ error: "Failed to connect to Ollama" });
  }
});

app.listen(5000, () => {
  console.log("Jarvis backend running on port 5000");
});
