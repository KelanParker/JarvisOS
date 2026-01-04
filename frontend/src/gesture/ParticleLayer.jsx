import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const STATE_COLORS = {
  idle: "#22d3ee", // cyan
  hand: "#3b82f6", // blue
  gesture: "#a855f7", // purple
  command: "#22c55e", // green
  error: "#ef4444", // red
};

const PARTICLE_COUNT = 60;
const BASE_RADIUS = 32;

function createParticles() {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.002,
    vy: (Math.random() - 0.5) * 0.002,
    size: 2 + Math.random() * 2,
    drift: Math.random() * Math.PI * 2,
    speed: 0.002 + Math.random() * 0.003,
  }));
}

function drawGlow(ctx, x, y, radius, color) {
  const gradient = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius);
  gradient.addColorStop(0, `${color}AA`);
  gradient.addColorStop(1, `${color}00`);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

const ParticleLayer = forwardRef(function ParticleLayer(_, ref) {
  const canvasRef = useRef(null);
  const particlesRef = useRef(createParticles());
  const stateRef = useRef("idle");
  const targetRef = useRef({ x: 0.5, y: 0.5, hasHand: false });
  const burstRef = useRef(0); // gesture recognized
  const pulseRef = useRef(0); // command executed
  const rafRef = useRef(null);

  useImperativeHandle(ref, () => ({
    setHandDetected: hasHand => {
      targetRef.current.hasHand = hasHand;
      if (!hasHand) stateRef.current = "idle";
      else if (stateRef.current === "idle") stateRef.current = "hand";
    },
    updateLandmarks: landmarks => {
      if (!landmarks?.length) return;
      const centroid = landmarks.reduce(
        (acc, point) => ({
          x: acc.x + point.x,
          y: acc.y + point.y,
        }),
        { x: 0, y: 0 }
      );
      centroid.x /= landmarks.length;
      centroid.y /= landmarks.length;
      targetRef.current.x = centroid.x;
      targetRef.current.y = centroid.y;
      targetRef.current.hasHand = true;
      if (stateRef.current === "idle") stateRef.current = "hand";
    },
    gestureRecognized: () => {
      burstRef.current = 1;
      stateRef.current = "gesture";
    },
    commandExecuted: () => {
      pulseRef.current = 1;
      stateRef.current = "command";
    },
    setError: () => {
      stateRef.current = "error";
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particlesRef.current.forEach(p => {
        p.x = Math.random() * width;
        p.y = Math.random() * height;
      });
    };

    resize();
    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    const render = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      const color = STATE_COLORS[stateRef.current] || STATE_COLORS.idle;

      // soften transitions
      particlesRef.current.forEach(p => {
        p.drift += p.speed;

        if (targetRef.current.hasHand) {
          const targetX = targetRef.current.x * width;
          const targetY = targetRef.current.y * height;
          p.x += (targetX - p.x) * 0.04 + Math.cos(p.drift) * 0.4;
          p.y += (targetY - p.y) * 0.04 + Math.sin(p.drift) * 0.4;
        } else {
          p.x += Math.cos(p.drift) * 0.6;
          p.y += Math.sin(p.drift) * 0.6;
        }

        // wrap edges softly
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
      });

      // ring effect
      const baseRadius = BASE_RADIUS;
      if (targetRef.current.hasHand) {
        const cx = targetRef.current.x * width;
        const cy = targetRef.current.y * height;

        const burst = burstRef.current;
        const pulse = pulseRef.current;
        const ringRadius = baseRadius + burst * 60 + pulse * 24;
        drawGlow(ctx, cx, cy, ringRadius, color);

        if (burstRef.current > 0) {
          burstRef.current = Math.max(0, burstRef.current - 0.02);
        }
        if (pulseRef.current > 0) {
          pulseRef.current = Math.max(0, pulseRef.current - 0.04);
        }
      }

      particlesRef.current.forEach(p => {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.15 + Math.random() * 0.35;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
});

export default ParticleLayer;
