import * as THREE from "three";

export function createRibbonCurve(offset = 0, twist = 1) {
  return new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(Math.cos(offset) * 1.8, 1.4, Math.sin(offset) * 1.8),
      new THREE.Vector3(
        Math.cos(offset + 0.6 * twist) * 3.1,
        6.8,
        Math.sin(offset + 0.6 * twist) * 2.6,
      ),
      new THREE.Vector3(
        Math.cos(offset + 1.35 * twist) * 2.6,
        12.8,
        Math.sin(offset + 1.35 * twist) * 2.3,
      ),
      new THREE.Vector3(
        Math.cos(offset + 2.2 * twist) * 1.6,
        19.2,
        Math.sin(offset + 2.2 * twist) * 1.4,
      ),
    ],
    false,
    "catmullrom",
    0.45,
  );
}

export function createFinCurve(side = 1, spread = 1.9) {
  return new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(side * spread, 0.6, -0.65),
      new THREE.Vector3(side * (spread + 1.2), 6.4, -0.2),
      new THREE.Vector3(side * 2.55, 12.8, 0.3),
      new THREE.Vector3(side * 1.2, 18.9, 0.1),
    ],
    false,
    "catmullrom",
    0.48,
  );
}
