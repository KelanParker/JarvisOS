import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { runJarvis } from "../jarvis-core/jarvisEngine.js";
import { tools } from "../jarvis-core/tools/toolRegistry.js";
import { isToolAllowed, loadProjectConfig } from "../jarvis-core/permissions/permissionManager.js";
import { addToSession, getSession } from "../jarvis-core/memory/sessionMemory.js";
import { getPersonality } from "../jarvis-core/personality/personalities.js";
import { runOllama } from "../jarvis-core/llm/ollamaClient.js";
import { runOnlineLLM } from "../jarvis-core/llm/onlineClient.js";

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { 
    message, 
    project = "default", 
    sessionId = "default",
    personality = "neutral",
    mode = "offline"  // offline (local) or online (cloud)
  } = req.body;

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

    addToSession(sessionId, "user", message);
    const session = getSession(sessionId);

    const conversationHistory = session
      .map(m => `${m.role}: ${m.content}`)
      .join("\n");

    // Get base personality prompt
    let systemPrompt = getPersonality(personality);
    
    // Add verbosity guidance
    if (decision.verbosity === "high") {
      systemPrompt += `\n\nVERBOSITY: Provide detailed, comprehensive explanations.`;
    } else {
      systemPrompt += `\n\nVERBOSITY: Keep responses concise and brief.`;
    }
    
    const numPredict = decision.verbosity === "high" ? 1000 : 100;

    console.log(`[JarvisOS] Mode: ${mode.toUpperCase()} | Personality: ${personality} | Verbosity: ${decision.verbosity} (Limit: ${numPredict} tokens)`);

    // Add mode awareness to system prompt
    let modeNote = "";
    if (mode === "online") {
      modeNote = `\n\n📡 MODE: You are currently in ONLINE MODE. You may reference external services if configured.`;
    } else {
      modeNote = `\n\n💻 MODE: You are currently in OFFLINE MODE using a local AI model.`;
    }
    systemPrompt += modeNote;

    // Add offline mode awareness for real-time queries
    let systemNote = "";
    if (decision.needsRealtime) {
      if (mode === "offline") {
        systemNote = `

⚠️ IMPORTANT NOTICE:
You are running in OFFLINE MODE with a local AI model.
If the question requires real-time, current, or up-to-date information:
- Clearly state that your knowledge may be outdated
- Do NOT guess or fabricate current facts
- Suggest verifying with official or live sources
- Be honest about your limitations
`;
      } else {
        systemNote = `\n\n⚠️ NOTICE: This query may require real-time information. Online mode is active but external data sources may not be configured.`;
      }
      console.log(`⚠️  Real-time query detected: "${message}"`);
    }

    const finalPrompt = `
${systemPrompt}${systemNote}

Conversation:
${conversationHistory}

Assistant:
`;

    // Route to appropriate LLM based on mode
    let reply;
    
    try {
      if (mode === "online") {
        // Use cloud LLM via Groq API
        console.log("[JarvisOS] 📡 Routing to ONLINE mode (Groq)");
        
        if (!process.env.GROQ_API_KEY) {
          console.warn("[JarvisOS] ⚠️  Online mode requested but GROQ_API_KEY not configured. Falling back to local LLM.");
          reply = await runOllama(finalPrompt, numPredict);
        } else {
          try {
            reply = await runOnlineLLM(finalPrompt, { 
              maxTokens: numPredict,
              model: "llama-3.3-70b-versatile"
            });
            console.log("[JarvisOS] ✅ Online mode response received");
          } catch (error) {
            console.error("[JarvisOS] ❌ Groq API failed:", error.message);
            console.log("[JarvisOS] 🔄 Falling back to local LLM...");
            reply = await runOllama(finalPrompt, numPredict);
          }
        }
      } else {
        // Use local Ollama LLM
        console.log("[JarvisOS] 💻 Routing to OFFLINE mode (Ollama)");
        reply = await runOllama(finalPrompt, numPredict);
      }
    } catch (error) {
      // Final fallback: try Ollama as last resort
      console.error("[JarvisOS] ❌ LLM error:", error.message);
      console.log("[JarvisOS] 🔄 Final fallback to local LLM...");
      try {
        reply = await runOllama(finalPrompt, numPredict);
      } catch (fallbackError) {
        console.error("[JarvisOS] ❌ All LLM attempts failed");
        return res.status(500).json({ error: "Failed to connect to any LLM" });
      }
    }

    if (!reply) {
      return res.status(500).json({ error: "Empty response from LLM" });
    }

    console.log("[JarvisOS] ✅ Reply ready, length:", reply.length);

    addToSession(sessionId, "assistant", reply);

    res.json({
      reply: reply,
      mode: mode
    });

  } catch (err) {
    console.error("[JarvisOS] ❌ LLM connection failed:", err);
    res.status(500).json({ error: "Failed to connect to LLM" });
  }
});

// API endpoint to get mode information
app.get("/mode", (req, res) => {
  const groqConfigured = !!process.env.GROQ_API_KEY;
  
  res.json({
    currentMode: "offline",
    availableModes: {
      offline: {
        name: "Offline Mode",
        description: "Local AI model (Ollama)",
        provider: "Ollama (dolphin3-abliterated:8b)",
        realtime: false,
        available: true
      },
      online: {
        name: "Online Mode",
        description: "Cloud AI services (Groq)",
        provider: "Groq (llama3-70b-8192)",
        realtime: false,
        available: groqConfigured
      }
    },
    note: groqConfigured 
      ? "Both offline and online modes are available." 
      : "Online mode is not configured. Set GROQ_API_KEY in .env to enable."
  });
});

// API endpoint to get available personalities
app.get("/personalities", (req, res) => {
  const personalities = {
    neutral: "Professional, factual, and direct",
    assistant: "Friendly, warm, and conversational",
    technical: "Precise terminology, assumes expertise",
    minimal: "Ultra-concise, 1-2 sentences only",
    creative: "Engaging with analogies and storytelling"
  };
  res.json({ personalities });
});

app.listen(5000, () => {
  console.log("[JarvisOS] 🚀 Backend server running on port 5000");
  console.log("[JarvisOS] 💻 Local LLM: Ollama (huihui_ai/dolphin3-abliterated:8b)");
  console.log(`[JarvisOS] 📡 Cloud LLM: ${process.env.GROQ_API_KEY ? 'Groq (llama-3.3-70b-versatile) ✓' : 'Not configured'}`);
}).on('error', (err) => {
  console.error("[JarvisOS] ❌ Server failed to start:", err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
