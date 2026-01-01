/**
 * Real-time Query Detector
 * Identifies when user queries likely require current/live information
 * 
 * Interview-safe: Simple keyword matching, explainable logic
 */

const REALTIME_KEYWORDS = [
  "current",
  "today",
  "now",
  "latest",
  "right now",
  "who is the president",
  "who is the prime minister",
  "price of",
  "news",
  "weather",
  "stock price",
  "score",
  "result",
  "happening",
  "this week",
  "this month",
  "this year",
  "2026",
  "recently"
];

/**
 * Check if a query requires real-time data
 * @param {string} text - User input text
 * @returns {boolean} - True if query likely needs current information
 */
export function requiresRealtimeData(text) {
  const lower = text.toLowerCase();
  return REALTIME_KEYWORDS.some(keyword => lower.includes(keyword));
}
