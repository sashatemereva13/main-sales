import { useEffect, useMemo } from "react";
import * as THREE from "three";

export default function usePavilionMaterials(preserveGlass) {
  const shellMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#f7f9f8", roughness: 0.36, metalness: 0.12, emissive: "#dfe9e5", emissiveIntensity: 0.06 }),
    [],
  );
  const whiteFrameMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#f3f6f4", roughness: 0.28, metalness: 0.18 }),
    [],
  );
  const glassMaterial = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: "#dff5ec", roughness: preserveGlass ? 0.1 : 0.28, metalness: 0.04, transmission: preserveGlass ? 0.56 : 0, thickness: preserveGlass ? 1.2 : 0.2, clearcoat: 0.9, clearcoatRoughness: 0.1, ior: 1.12, emissive: "#87d6b0", emissiveIntensity: 0.08, transparent: true, opacity: 0.96 }),
    [preserveGlass],
  );
  const lawnMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#67a545", roughness: 0.94, emissive: "#356729", emissiveIntensity: 0.08 }),
    [],
  );
  const glowMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#c6ffd7", transparent: true, opacity: 0.28, depthWrite: false }),
    [],
  );
  const terraceRimMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#f4e2bf", transparent: true, opacity: 0.78, depthWrite: false }),
    [],
  );

  useEffect(
    () => () =>
      [shellMaterial, whiteFrameMaterial, glassMaterial, lawnMaterial, glowMaterial, terraceRimMaterial].forEach((material) => material.dispose()),
    [shellMaterial, whiteFrameMaterial, glassMaterial, lawnMaterial, glowMaterial, terraceRimMaterial],
  );

  return { shellMaterial, whiteFrameMaterial, glassMaterial, lawnMaterial, glowMaterial, terraceRimMaterial };
}
