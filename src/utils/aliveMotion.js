export function applyAliveMotion({ mesh, time, seed = 0.01, intensity }) {
  if (!mesh) return;

  const t = time + seed;

  // breath
  const breath = 1 + Math.sin(t * 0.8) * 0.03 * intensity;

  mesh.scale.setScalar(breath);

  // floating drift
  mesh.position.y = Math.sin(t * 0.4) * 0.15 * intensity;

  mesh.position.x = Math.cos(t * 0.4) * 0.1 * intensity;

  // organic rotation

  mesh.rotation.x += Math.sin(t * 0.3) * 0.0015 * intensity;

  mesh.rotation.y += Math.cos(t * 0.25) * 0.002 * intensity;

  // emissive shimmer
  if (mesh.material?.emissivIntensity !== undefined) {
    mesh.material.emissivIntensity = 0.25 + Math.sin(t * 1.2) * 0.15;
  }
}
