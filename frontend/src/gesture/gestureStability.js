let lastGesture = null;
let stableCount = 0;

export function getStableGesture(gesture) {
  if (!gesture) {
    lastGesture = null;
    stableCount = 0;
    return null;
  }

  if (gesture === lastGesture) {
    stableCount += 1;
  } else {
    lastGesture = gesture;
    stableCount = 1;
  }

  if (stableCount >= 8) {
    stableCount = 0;
    return gesture;
  }

  return null;
}
