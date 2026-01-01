/**
 * Online LLM Client (Groq)
 * Handles communication with Groq cloud API
 * 
 * Requires: GROQ_API_KEY in environment variables
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Execute prompt using Groq cloud LLM
 * @param {string} prompt - The complete prompt to send
 * @param {object} options - Additional options (temperature, max_tokens, etc.)
 * @returns {Promise<string>} - The LLM response
 */
export async function runOnlineLLM(prompt, options = {}) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  
  if (!GROQ_API_KEY) {
    console.error("[Online LLM] GROQ_API_KEY not found in environment");
    throw new Error("Online mode requires GROQ_API_KEY to be configured");
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: options.model || "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are JarvisOS running in ONLINE mode with cloud AI capabilities." },
          { role: "user", content: prompt }
        ],
        temperature: options.temperature || 0.5,
        max_tokens: options.max_tokens || 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Online LLM] API error:", errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("[Online LLM] Request failed:", error.message);
    throw error;
  }
}
