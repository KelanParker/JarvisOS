export async function runJarvis(message) {
  const lower = message.toLowerCase();

  if (lower.includes("laptop") || lower.includes("not turning on")) {
    return {
      type: "repair",
      prompt: `You are RepairMateAI. Help diagnose this issue:\n${message}`
    };
  }

  return {
    type: "chat",
    prompt: message
  };
}
