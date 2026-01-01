import express from "express";
import cors from "cors";
import { runJarvis } from "../jarvis-core/jarvisEngine.js";
import { tools } from "../jarvis-core/tools/toolRegistry.js";
import { isToolAllowed, loadProjectConfig } from "../jarvis-core/permissions/permissionManager.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message, project = "default" } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const projectConfig = loadProjectConfig(project);
    const decision = await runJarvis(message);
    console.log("Jarvis Intent:", decision.intent);

    if (decision.intent === "tool") {
      if (!isToolAllowed(decision.tool, projectConfig)) {
        return res.json({
          reply: "This action is not permitted for this project."
        });
      }

      const result = tools[decision.tool]();
      return res.json({ reply: result });
    }

    const prompt = decision.prompt;

    const ollamaResponse = await fetch(
      "http://localhost:11434/api/generate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "huihui_ai/dolphin3-abliterated:8b",
          prompt: prompt,
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
}).on('error', (err) => {
  console.error("Server failed to start:", err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
