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

  let verbosity = "low";
  if (text.includes("explain in detail") || text.includes("deeply")) {
    verbosity = "high";
  }

  return {
    intent: "chat",
    prompt: input,
    verbosity
  };
}
