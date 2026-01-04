import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createParticleHand } from "./ParticleHand";
import { burstParticles, expandParticles, resetParticles, setParticleState } from "./particleController";

export default function ParticleCanvas({ state = "idle" }) {
  const mountRef = useRef(null);
  const particlesRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const particles = createParticleHand(scene);
    particlesRef.current = particles;

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current) return;
      const { clientWidth, clientHeight } = mountRef.current;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(clientWidth, clientHeight);
    };

    window.addEventListener("resize", handleResize);

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.002;
        particlesRef.current.rotation.x += 0.001;
      }
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (mount.firstChild) mount.removeChild(mount.firstChild);
    };
  }, []);

  useEffect(() => {
    const particles = particlesRef.current;
    if (!particles) return;

    setParticleState(particles, state);
    if (state === "gesture" || state === "stable") {
      expandParticles(particles);
    } else if (state === "executed") {
      burstParticles(particles);
    } else if (state === "idle") {
      resetParticles(particles);
    }
  }, [state]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      style={{ filter: "drop-shadow(0 0 12px rgba(0, 255, 255, 0.2))" }}
    />
  );
}
