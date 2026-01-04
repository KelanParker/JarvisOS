import { GESTURES } from "./gestureConstants";

export const gestureCommandMap = {
  OPEN_PALM: "/wake",
  FIST: "/sleep",
  PINCH: "/confirm",
};

const FINGER_TIPS = [8, 12, 16, 20];
const FINGER_PIPS = [6, 10, 14, 18];

function isPinching(landmarks) {
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];

  const distance = Math.hypot(
    thumbTip.x - indexTip.x,
    thumbTip.y - indexTip.y
  );

  // Use depth to filter accidental overlaps; require hand slightly towards camera
  return distance < 0.025 && thumbTip.z < -0.02;
}

function countExtendedFingers(landmarks) {
  return FINGER_TIPS.filter((tip, i) => {
    const pip = FINGER_PIPS[i];
    return landmarks[tip].y < landmarks[pip].y - 0.02;
  }).length;
}

function isFist(landmarks) {
  const wrist = landmarks[0];

  const tipDistances = FINGER_TIPS.map(tip =>
    Math.hypot(landmarks[tip].x - wrist.x, landmarks[tip].y - wrist.y)
  );

  const averageTipDistance =
    tipDistances.reduce((total, value) => total + value, 0) /
    tipDistances.length;

  const wristToIndexMCP = Math.hypot(
    landmarks[0].x - landmarks[5].x,
    landmarks[0].y - landmarks[5].y
  );

  return averageTipDistance < wristToIndexMCP * 0.8;
}

export function detectGesture(landmarks) {
  if (!landmarks?.length) return null;

  if (isPinching(landmarks)) return GESTURES.PINCH;

  if (countExtendedFingers(landmarks) >= 3) return GESTURES.OPEN_PALM;

  if (isFist(landmarks)) return GESTURES.FIST;

  return null;
}
