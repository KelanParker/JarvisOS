import { useEffect, useRef } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

export default function HandTracker({ onGesture, onLandmarks, onHandPresenceChange, onError }) {
  const videoRef = useRef(null);
  const callbacksRef = useRef({ onGesture, onLandmarks, onHandPresenceChange });
  const lastFrameRef = useRef(0);

  useEffect(() => {
    callbacksRef.current = { onGesture, onLandmarks, onHandPresenceChange, onError };
  }, [onGesture, onLandmarks, onHandPresenceChange, onError]);

  useEffect(() => {
    const hands = new Hands({
      locateFile: file =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults(results => {
      const callbacks = callbacksRef.current;
      const landmarks = results.multiHandLandmarks?.[0];
      const hasHand = !!landmarks;

      callbacks.onHandPresenceChange?.(hasHand);

      if (landmarks) {
        callbacks.onLandmarks?.(landmarks);
        callbacks.onGesture?.(landmarks);
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        const now = Date.now();
        if (now - lastFrameRef.current < 50) return; // throttle ~20 fps
        lastFrameRef.current = now;
        await hands.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.start().catch(err => {
      callbacksRef.current.onError?.(err);
    });
  }, []);

  return <video ref={videoRef} style={{ display: "none" }} />;
}
