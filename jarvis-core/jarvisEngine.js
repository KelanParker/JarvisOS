import { tools } from "./tools/toolRegistry.js";

export async function runJarvis(input, context = "default") {
  const text = input.toLowerCase();

  if (text.includes("time")) {
    return {
      intent: "tool",
      tool: "getTime",
      context
    };
  }

  if (text.includes("system info")) {
    return {
      intent: "tool",
      tool: "systemInfo"
    };
  }

  return {
    intent: "chat",
    prompt: input
  };
}
