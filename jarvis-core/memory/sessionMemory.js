const sessions = new Map();

export function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, []);
  }
  return sessions.get(sessionId);
}

export function addToSession(sessionId, role, content) {
  const session = getSession(sessionId);
  session.push({ role, content });

  // keep last 10 messages only
  if (session.length > 10) {
    session.shift();
  }
}
