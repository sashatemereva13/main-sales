import * as THREE from "three";

export const GROUND_MESH_OFFSET = Object.freeze({
  x: 0,
  y: -0.12,
  z: -8,
});

export const FOREST_BACKDROP_OFFSET = Object.freeze({
  x: 0,
  y: -1.95,
  z: -46,
});

const TERRAIN_SPHERE_RADIUS = 2200;

export function sampleSphereCurvature(worldX, worldZ) {
  const d2 = worldX * worldX + worldZ * worldZ;
  const maxD2 = (TERRAIN_SPHERE_RADIUS - 1) * (TERRAIN_SPHERE_RADIUS - 1);
  const clamped = Math.min(d2, maxD2);
  return Math.sqrt(TERRAIN_SPHERE_RADIUS * TERRAIN_SPHERE_RADIUS - clamped) - TERRAIN_SPHERE_RADIUS;
}

function sampleMeadowDetail(worldX, worldZ) {
  const swellA = Math.sin(worldX * 0.016) * Math.cos(worldZ * 0.014) * 0.78;
  const swellB = Math.sin((worldX + worldZ) * 0.009) * 0.56;
  const swellC = Math.cos((worldX - worldZ) * 0.007) * 0.42;
  const micro = Math.sin(worldX * 0.07 + worldZ * 0.045) * 0.07;
  return swellA + swellB + swellC + micro - 0.22;
}

export function sampleMeadowSurfaceHeight(worldX, worldZ) {
  return sampleSphereCurvature(worldX, worldZ) + sampleMeadowDetail(worldX, worldZ);
}

function sampleForestRidge(worldX, worldZ) {
  const localZ = worldZ - FOREST_BACKDROP_OFFSET.z;
  const backBand = Math.exp(-Math.pow((localZ + 92) / 58, 2));
  const ridge =
    backBand *
    (9.5 + Math.sin(worldX * 0.03) * 2.8 + Math.cos(worldX * 0.017) * 2.2);
  const shoulder =
    Math.exp(-Math.pow((localZ + 132) / 48, 2)) *
    (6.2 + Math.sin(worldX * 0.02 + 1.4) * 1.8);
  const taper = Math.exp(-Math.pow((localZ + 28) / 110, 2)) * 1.15;
  return ridge + shoulder - taper;
}

export function sampleForestSurfaceHeight(worldX, worldZ) {
  return (
    FOREST_BACKDROP_OFFSET.y +
    sampleForestRidge(worldX, worldZ) +
    sampleSphereCurvature(worldX, worldZ) * 0.82
  );
}

export function sampleVisibleTerrainHeight(worldX, worldZ) {
  const meadow = sampleMeadowSurfaceHeight(worldX, worldZ) + GROUND_MESH_OFFSET.y;
  if (worldZ > -55) return meadow;

  const ridge = sampleForestSurfaceHeight(worldX, worldZ);
  const blend = THREE.MathUtils.smoothstep(worldZ, -55, -78);
  return THREE.MathUtils.lerp(meadow, ridge, blend);
}
