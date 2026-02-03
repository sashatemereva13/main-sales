// components/scenes/MiniScene.jsx
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { applyAliveMotion } from "../utils/aliveMotion";

export default function MiniScene() {
  const groupRef = useRef(); // 👈 NEW
  const meshRef = useRef();
  const seedRef = useRef(Math.random() * 1000);

  const spread = 5;
  const depth = 0.6;

  const { geometry, material, position, rotation, rotationSpeed } =
    useMemo(() => {
      const seed = seedRef.current;
      const rand = () => THREE.MathUtils.seededRandom(seed);

      const geometry = new THREE.SphereGeometry(1.05, 64, 64);
      const pos = geometry.attributes.position;

      // 🌸 Petal deformation
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);

        const angle = Math.atan2(y, x);
        const radius = Math.sqrt(x * x + y * y + z * z);
        const petal = Math.cos(angle * 6.0 + seed) * 0.12;
        const scale = 1.0 + petal * (radius * 0.6);

        pos.setXYZ(i, x * scale, y * scale, z * scale);
      }

      geometry.computeVertexNormals();

      const material = new THREE.MeshPhysicalMaterial({
        color: "#E6D9FF",
        roughness: 0.32,
        transmission: 0.28,
        thickness: 0.7,
        emissive: "#BFA8FF",
        emissiveIntensity: 0.14,
        clearcoat: 0.6,
        clearcoatRoughness: 0.3,
        transparent: true,
        opacity: 0.28,
      });

      return {
        geometry,
        material,
        position: [
          (rand() - 0.5) * spread,
          (rand() - 0.5) * spread,
          (rand() - 0.5) * depth,
        ],
        rotation: [
          rand() * 0.5 * Math.PI,
          rand() * 0.5 * Math.PI,
          rand() * 0.25 * Math.PI,
        ],
        rotationSpeed: {
          x: (rand() - 0.5) * 0.04,
          y: (rand() - 0.5) * 0.03,
          z: (rand() - 0.5) * 0.02,
        },
      };
    }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current) return;

    const t = state.clock.elapsedTime;
    const seed = seedRef.current;

    // 🌀 slow rotation → GROUP (never overridden)
    groupRef.current.rotation.x += rotationSpeed.x * 0.001;
    groupRef.current.rotation.y += rotationSpeed.y * 0.001;
    groupRef.current.rotation.z += rotationSpeed.z * 0.001;

    // vertical drift → GROUP
    groupRef.current.position.y += Math.sin(t * 0.3 + seed) * 0.0006;

    // 🌬 breathing → MESH
    const breath = 0.97 + 0.03 * Math.sin(t * 0.7 + seed);
    meshRef.current.scale.setScalar(breath);

    // organic micro-life → MESH
    applyAliveMotion({
      mesh: meshRef.current,
      time: t,
      seed,
      intensity: 0.12,
    });
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <mesh ref={meshRef} geometry={geometry} material={material} />
    </group>
  );
}
