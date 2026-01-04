export function setParticleState(particles, state) {
  if (!particles) return;
  const colors = {
    idle: 0x00ffff,
    detected: 0x3399ff,
    stable: 0xaa00ff,
    gesture: 0xaa00ff,
    executed: 0x00ff88,
    error: 0xff0033,
  };

  const hex = colors[state] ?? colors.idle;
  particles.material.color.setHex(hex);
}

export function expandParticles(particles) {
  if (!particles) return;
  particles.scale.set(1.4, 1.4, 1.4);
}

export function resetParticles(particles) {
  if (!particles) return;
  particles.scale.set(1, 1, 1);
}

export function burstParticles(particles) {
  if (!particles) return;
  particles.scale.set(2, 2, 2);
  setTimeout(() => resetParticles(particles), 200);
}
