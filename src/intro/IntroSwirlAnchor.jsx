import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

export default function IntroSwirlAnchor({
  position = [0, 17, -12],
  introProgress = 1,
  beamLength = 12,
}) {
  const groupRef = useRef(null);
  const coreRef = useRef(null);
  const innerRingRef = useRef(null);
  const outerRingRef = useRef(null);
  const beamRef = useRef(null);
  const beamHaloRef = useRef(null);
  const lightRef = useRef(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const reveal = easeOutCubic(Math.min(Math.max(introProgress, 0), 1));
    const idleLift = Math.sin(t * 0.42) * (0.14 + reveal * 0.28);
    const driftX = Math.sin(t * 0.28 + 0.6) * 0.18 * reveal;
    const driftZ = Math.cos(t * 0.22 + 0.2) * 0.32 * reveal;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * (0.22 + reveal * 0.56);
      groupRef.current.position.x = position[0] + driftX;
      groupRef.current.position.y = position[1] + idleLift;
      groupRef.current.position.z = position[2] + driftZ;
      const groupScale = 0.76 + reveal * 0.34 + Math.sin(t * 0.9) * 0.015;
      groupRef.current.scale.setScalar(groupScale);
    }

    if (coreRef.current?.material) {
      coreRef.current.material.emissiveIntensity =
        0.45 + reveal * 1.05 + Math.sin(t * 1.6) * 0.08;
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = t * (0.5 + reveal * 0.95);
      innerRingRef.current.rotation.x =
        Math.sin(t * 0.26 + 0.4) * (0.08 + reveal * 0.22);
      innerRingRef.current.rotation.y = Math.cos(t * 0.31) * 0.12 * reveal;
      innerRingRef.current.scale.setScalar(0.94 + reveal * 0.14);
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = -t * (0.22 + reveal * 0.62);
      outerRingRef.current.rotation.x =
        Math.cos(t * 0.22 + 0.8) * (0.14 + reveal * 0.26);
      outerRingRef.current.rotation.y = Math.sin(t * 0.18 + 0.5) * 0.18 * reveal;
      outerRingRef.current.scale.setScalar(1.04 + reveal * 0.24);
    }

    if (beamRef.current?.material) {
      beamRef.current.material.opacity =
        0.12 + reveal * 0.2 + Math.sin(t * 1.1 + 0.2) * 0.02;
      beamRef.current.scale.x = 0.92 + reveal * 0.18;
      beamRef.current.scale.z = 0.92 + reveal * 0.18;
    }

    if (beamHaloRef.current?.material) {
      beamHaloRef.current.material.opacity =
        0.08 + reveal * 0.12 + Math.cos(t * 0.9 + 0.4) * 0.015;
      beamHaloRef.current.scale.setScalar(0.96 + reveal * 0.12);
    }

    if (lightRef.current) {
      lightRef.current.intensity =
        0.55 + reveal * 2.3 + Math.sin(t * 1.2 + 0.3) * 0.14;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh
        ref={beamRef}
        position={[0, -(beamLength * 0.5 + 1.8), 0]}
        renderOrder={4}
      >
        <cylinderGeometry args={[0.55, 1.15, beamLength, 24, 1, true]} />
        <meshBasicMaterial
          color="#ffd9b3"
          transparent
          opacity={0.24}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh
        ref={beamHaloRef}
        position={[0, -(beamLength + 1.9), 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={5}
      >
        <circleGeometry args={[1.6, 40]} />
        <meshBasicMaterial
          color="#ffe2be"
          transparent
          opacity={0.16}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={coreRef} castShadow receiveShadow>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#ffd8ac"
          emissive="#a6642a"
          emissiveIntensity={1.05}
          roughness={0.24}
          metalness={0.08}
        />
      </mesh>

      <mesh ref={innerRingRef} renderOrder={7}>
        <torusGeometry args={[2.9, 0.09, 16, 72]} />
        <meshBasicMaterial
          color="#ffe5c5"
          transparent
          opacity={0.52}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={outerRingRef} renderOrder={6}>
        <torusGeometry args={[4.35, 0.045, 16, 120]} />
        <meshBasicMaterial
          color="#ffd7ae"
          transparent
          opacity={0.28}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <pointLight
        ref={lightRef}
        color="#ffca97"
        intensity={1.9}
        distance={40}
        decay={2}
      />
    </group>
  );
}
