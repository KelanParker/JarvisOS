import fs from "fs";

export function loadProjectConfig(project = "default") {
  const raw = fs.readFileSync(`projects/${project}.config.json`);
  return JSON.parse(raw);
}

export function isToolAllowed(toolName, projectConfig) {
  return projectConfig.allowedTools.includes(toolName);
}
