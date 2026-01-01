/**
 * Ollama Local LLM Client
 * Handles communication with local Ollama instance
 */

/**
 * Execute prompt using local Ollama LLM
 * @param {string} prompt - The complete prompt to send to Ollama
 * @param {number} numPredict - Max tokens to generate
 * @returns {Promise<string>} - The LLM response
 */
export async function runOllama(prompt, numPredict = 250) {
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "huihui_ai/dolphin3-abliterated:8b",
        prompt: prompt,
        stream: false,
        num_predict: numPredict
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Ollama] API error:", errorText);
      throw new Error("Ollama API error");
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("[Ollama] Connection failed:", error.message);
    throw error;
  }
}
