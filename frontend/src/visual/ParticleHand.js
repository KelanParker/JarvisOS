import * as THREE from "three";

export function createParticleHand(scene) {
  const geometry = new THREE.BufferGeometry();
  const particles = 800;

  const positions = new Float32Array(particles * 3);
  for (let i = 0; i < particles * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 2;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 0.015,
    transparent: true,
    opacity: 0.9,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  return points;
}
