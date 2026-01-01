export async function runJarvis(input) {
  const text = input.toLowerCase();

  // UNIVERSAL intent classification
  if (text.startsWith("open") || text.startsWith("run")) {
    return {
      intent: "action",
      prompt: input
    };
  }

  if (text.includes("explain") || text.includes("what is")) {
    return {
      intent: "knowledge",
      prompt: input
    };
  }

  return {
    intent: "chat",
    prompt: input
  };
}
