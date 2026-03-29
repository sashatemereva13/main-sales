import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { ANIME_STYLE, outlineOpacity } from "../animeStyle";

function createToonGradientMap(values) {
  const data = new Uint8Array(values);
  const texture = new THREE.DataTexture(
    data,
    values.length,
    1,
    THREE.RedFormat,
  );
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

export default function useSanctuaryMaterials(preserveGlass) {
  const architectureGradient = useMemo(
    () => createToonGradientMap([26, 86, 156, 224, 255]),
    [],
  );
  const foliageGradient = useMemo(
    () => createToonGradientMap([20, 74, 132, 186, 255]),
    [],
  );

  const shellMaterial = useMemo(
    () =>
      new THREE.MeshToonMaterial({
        color: "#f8f7ff",
        gradientMap: architectureGradient,
        emissive: "#d7dcff",
        emissiveIntensity: 0.13,
      }),
    [architectureGradient],
  );
  const trimMaterial = useMemo(
    () =>
      new THREE.MeshToonMaterial({
        color: "#fffef9",
        gradientMap: architectureGradient,
        emissive: "#e8edff",
        emissiveIntensity: 0.1,
      }),
    [architectureGradient],
  );
  const accentMaterial = useMemo(
    () =>
      new THREE.MeshToonMaterial({
        color: "#e6c7ad",
        gradientMap: architectureGradient,
        emissive: "#9f7d60",
        emissiveIntensity: 0.07,
      }),
    [architectureGradient],
  );
  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#edf4ff",
        roughness: preserveGlass ? 0.06 : 0.18,
        metalness: 0.02,
        transmission: preserveGlass ? 0.8 : 0.18,
        thickness: preserveGlass ? 2.2 : 0.35,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        ior: 1.12,
        emissive: "#bfd0ff",
        emissiveIntensity: 0.07,
        transparent: true,
        opacity: 0.9,
      }),
    [preserveGlass],
  );
  const portalCoreMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#ddffef",
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
      }),
    [],
  );
  const glowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#cce1ff",
        transparent: true,
        opacity: 0.31,
        depthWrite: false,
      }),
    [],
  );
  const mossMaterial = useMemo(
    () =>
      new THREE.MeshToonMaterial({
        color: "#60a452",
        gradientMap: foliageGradient,
        emissive: "#3b6a32",
        emissiveIntensity: 0.09,
      }),
    [foliageGradient],
  );
  const shadowMaterial = useMemo(
    () =>
      new THREE.MeshToonMaterial({
        color: "#7681a6",
        gradientMap: architectureGradient,
        emissive: "#384571",
        emissiveIntensity: 0.05,
      }),
    [architectureGradient],
  );
  const outlineMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: ANIME_STYLE.outline.color,
        side: THREE.BackSide,
        transparent: true,
        opacity: outlineOpacity(ANIME_STYLE.outline.opacity),
        depthWrite: false,
      }),
    [],
  );

  useEffect(
    () => () =>
      [
        architectureGradient,
        foliageGradient,
        shellMaterial,
        trimMaterial,
        accentMaterial,
        glassMaterial,
        portalCoreMaterial,
        glowMaterial,
        mossMaterial,
        shadowMaterial,
        outlineMaterial,
      ].forEach((material) => material.dispose()),
    [
      architectureGradient,
      foliageGradient,
      shellMaterial,
      trimMaterial,
      accentMaterial,
      glassMaterial,
      portalCoreMaterial,
      glowMaterial,
      mossMaterial,
      shadowMaterial,
      outlineMaterial,
    ],
  );

  return {
    shellMaterial,
    trimMaterial,
    accentMaterial,
    glassMaterial,
    portalCoreMaterial,
    glowMaterial,
    mossMaterial,
    shadowMaterial,
    outlineMaterial,
  };
}
