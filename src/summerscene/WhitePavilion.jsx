import { useMemo, useRef } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sampleVisibleTerrainHeight } from "./terrainSurface";

export const WHITE_PAVILION_CENTER = Object.freeze([40, -27]);
export const WHITE_PAVILION_BASE_Y =
  sampleVisibleTerrainHeight(
    WHITE_PAVILION_CENTER[0],
    WHITE_PAVILION_CENTER[1],
  ) - 0.35;
export const WHITE_PAVILION_SCALE = Object.freeze([2.48, 3, 3.18]);
export const WHITE_PAVILION_WORLD_POSITION = Object.freeze([
  WHITE_PAVILION_CENTER[0],
  WHITE_PAVILION_BASE_Y,
  WHITE_PAVILION_CENTER[1],
]);
const WHITE_PAVILION_SCREEN_GROUP_POSITION = Object.freeze([0, 1.55, 0.5]);
const WHITE_PAVILION_SCREEN_CENTER_LOCAL = Object.freeze([0, 2.9, 0.22]);

function pavilionLocalToWorld([x, y, z]) {
  return Object.freeze([
    WHITE_PAVILION_WORLD_POSITION[0] + x * WHITE_PAVILION_SCALE[0],
    WHITE_PAVILION_WORLD_POSITION[1] + y * WHITE_PAVILION_SCALE[1],
    WHITE_PAVILION_WORLD_POSITION[2] + z * WHITE_PAVILION_SCALE[2],
  ]);
}

export const WHITE_PAVILION_SCREEN_WORLD_POSITION = pavilionLocalToWorld([
  WHITE_PAVILION_SCREEN_GROUP_POSITION[0] +
    WHITE_PAVILION_SCREEN_CENTER_LOCAL[0],
  WHITE_PAVILION_SCREEN_GROUP_POSITION[1] +
    WHITE_PAVILION_SCREEN_CENTER_LOCAL[1],
  WHITE_PAVILION_SCREEN_GROUP_POSITION[2] +
    WHITE_PAVILION_SCREEN_CENTER_LOCAL[2],
]);
export const WHITE_PAVILION_LOOK_AT_POSITION = Object.freeze([
  WHITE_PAVILION_CENTER[0] + 8,
  WHITE_PAVILION_BASE_Y + 22,
  WHITE_PAVILION_CENTER[1] + 1.2,
]);
export const WHITE_PAVILION_INTERIOR_CAMERA_POSITION = Object.freeze([
  WHITE_PAVILION_SCREEN_WORLD_POSITION[0],
  WHITE_PAVILION_SCREEN_WORLD_POSITION[1] + 0.06,
  WHITE_PAVILION_SCREEN_WORLD_POSITION[2] + 2.5,
]);
export const WHITE_PAVILION_INTERIOR_LOOK_AT_POSITION =
  WHITE_PAVILION_SCREEN_WORLD_POSITION;
export const WHITE_PAVILION_SWIRL_POSITION = Object.freeze([
  WHITE_PAVILION_CENTER[0],
  WHITE_PAVILION_BASE_Y + 42,
  WHITE_PAVILION_CENTER[1],
]);

const _color = new THREE.Color();

function GlassPillar({ position, height = 9.4, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, height * 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.34, 0.56, height, 18]} />
        <meshPhysicalMaterial
          color="#ffe7d2"
          transparent
          opacity={0.48}
          roughness={0.14}
          metalness={0}
          transmission={0.72}
          thickness={1.1}
          ior={1.12}
          emissive="#f6c9b6"
          emissiveIntensity={0.12}
        />
      </mesh>
      <mesh position={[0, height + 1.35, 0]}>
        <sphereGeometry args={[0.34, 16, 16]} />
        <meshStandardMaterial
          color="#ffdcb7"
          emissive="#ffc08c"
          emissiveIntensity={0.48}
          roughness={0.35}
        />
      </mesh>
    </group>
  );
}

function BeamPlane({ position, rotation, scale = [1, 1, 1], opacity = 0.14 }) {
  return (
    <mesh position={position} rotation={rotation} scale={scale} renderOrder={2}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#ffd8a8"
        transparent
        opacity={opacity}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function LabDisplayScreen() {
  const screenRef = useRef(null);

  useFrame(({ clock }) => {
    if (!screenRef.current) return;
    const t = clock.elapsedTime;
    screenRef.current.position.y =
      WHITE_PAVILION_SCREEN_GROUP_POSITION[1] + Math.sin(t * 0.78) * 0.22;
    screenRef.current.rotation.y = Math.sin(t * 0.32) * 0.08;
    screenRef.current.rotation.x = Math.sin(t * 0.26) * 0.035;
  });

  return (
    <group ref={screenRef} position={WHITE_PAVILION_SCREEN_GROUP_POSITION}>
      <mesh position={[0, 0.6, -0.12]} castShadow receiveShadow>
        <cylinderGeometry args={[3.38, 7.72, 0.18, 32]} />
        <meshStandardMaterial
          color="#f0dbc6"
          roughness={0.58}
          metalness={0.04}
        />
      </mesh>

      <mesh
        position={[0, 2.9, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[2.08, 2.08, 0.14, 64]} />
        <meshPhysicalMaterial
          color="#ffe3d0"
          roughness={0.2}
          metalness={0.04}
          clearcoat={0.82}
          clearcoatRoughness={0.18}
          transmission={0.06}
          emissive="#f6b695"
          emissiveIntensity={0.06}
        />
      </mesh>

      <mesh position={[0, 2.9, 0.16]}>
        <circleGeometry args={[1.82, 64]} />
        <meshBasicMaterial color="#0f3f31" transparent opacity={0.94} />
      </mesh>

      <mesh position={[0, 2.9, 0.28]}>
        <circleGeometry args={[1.68, 64]} />
        <meshBasicMaterial color="#6de0ab" transparent opacity={0.1} />
      </mesh>

      <mesh position={[0, 3.18, 0.22]}>
        <circleGeometry args={[1.18, 48]} />
        <meshBasicMaterial color="#9ef6c3" transparent opacity={0.08} />
      </mesh>

      <mesh position={[0, 2.6, 0.22]}>
        <torusGeometry args={[1.1, 0.035, 12, 72]} />
        <meshBasicMaterial color="#b9ffd2" transparent opacity={0.34} />
      </mesh>

      <Text
        font="/fonts/Canobis.ttf"
        position={[0, 2.9, 0.24]}
        fontSize={0.28}
        maxWidth={2.2}
        letterSpacing={0.08}
        lineHeight={1}
        color="#eef7ea"
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        Website
      </Text>

      <Text
        font="/fonts/Canobis.ttf"
        position={[0, 2.6, 0.3]}
        fontSize={0.24}
        maxWidth={2.2}
        letterSpacing={0.1}
        lineHeight={1}
        color="#cde8d7"
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        Builder
      </Text>
    </group>
  );
}

function ConnectorLine({ start, end, color = "#ffd8a8" }) {
  const lineRef = useRef(null);
  const points = useMemo(
    () => [new THREE.Vector3(...start), new THREE.Vector3(...end)],
    [start, end],
  );

  useFrame(({ clock }) => {
    if (!lineRef.current) return;
    const pulse = 0.32 + Math.sin(clock.elapsedTime * 1.2 + start[0]) * 0.08;
    lineRef.current.material.opacity = pulse;
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap((point) => point.toArray()))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={0.28}
        depthWrite={false}
      />
    </line>
  );
}

function FloatingNode({ position, size = 0.26, color = "#ffd8a8", phase = 0 }) {
  const ref = useRef(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime + phase;
    ref.current.position.y = position[1] + Math.sin(t * 0.9) * 0.24;
    ref.current.material.emissiveIntensity = 0.48 + Math.sin(t * 1.6) * 0.14;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 14, 14]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.56}
        roughness={0.24}
      />
    </mesh>
  );
}

function ParticleField() {
  const pointsRef = useRef(null);
  const positions = useMemo(() => {
    const data = [];
    for (let i = 0; i < 42; i += 1) {
      const angle = (i / 42) * Math.PI * 2;
      const radius = 3.8 + (i % 6) * 0.5;
      data.push(
        Math.cos(angle) * radius,
        3.2 + (i % 5) * 1.4,
        Math.sin(angle) * radius,
      );
    }
    return new Float32Array(data);
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.elapsedTime * 0.06;
  });

  return (
    <points ref={pointsRef} renderOrder={1}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.18}
        color="#ffe7d2"
        transparent
        opacity={0.36}
        depthWrite={false}
      />
    </points>
  );
}

function AmbientHalo() {
  const haloRef = useRef(null);

  useFrame(({ clock }) => {
    if (!haloRef.current) return;
    const t = clock.elapsedTime;
    haloRef.current.rotation.z = Math.sin(t * 0.16) * 0.08;
    haloRef.current.material.opacity = 0.1 + Math.sin(t * 0.9) * 0.018;
  });

  return (
    <mesh
      ref={haloRef}
      position={[0, 8.5, -2.4]}
      rotation={[-0.22, 0, 0]}
      renderOrder={0}
    >
      <planeGeometry args={[16, 11]} />
      <meshBasicMaterial
        color="#ffd8a8"
        transparent
        opacity={0.1}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function WhitePavilion() {
  const labGroupRef = useRef(null);
  const ringRefs = useRef([]);
  const orbitNodesRef = useRef([]);
  const coreShellRef = useRef(null);
  const coreGlowRef = useRef(null);
  const rearRingRef = useRef(null);
  const beamGroupRef = useRef(null);

  const plinthMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f3ddc7",
        roughness: 0.88,
        metalness: 0.02,
        emissive: "#f1b691",
        emissiveIntensity: 0.05,
      }),
    [],
  );

  const frameMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffd8bf",
        roughness: 0.36,
        metalness: 0.12,
        emissive: "#ffc08c",
        emissiveIntensity: 0.08,
      }),
    [],
  );

  const nodeAnchors = useMemo(
    () => [
      [-4.8, 6.1, -2.4],
      [4.1, 6.8, -4.3],
      [-2.9, 8.6, 4.7],
      [5.4, 8.1, 2.8],
      [0.6, 10.6, -1.6],
      [-5.2, 4.5, 3.4],
    ],
    [],
  );

  const connectorPairs = useMemo(
    () => [
      { start: [-4.8, 6.1, -2.4], end: [0, 6, 0] },
      { start: [4.1, 6.8, -4.3], end: [0, 6, 0] },
      { start: [-2.9, 8.6, 4.7], end: [0, 6, 0] },
      { start: [5.4, 8.1, 2.8], end: [0, 6, 0] },
      { start: [-5.2, 4.5, 3.4], end: [-1.8, 5.2, 1.4] },
    ],
    [],
  );

  const pillarData = useMemo(
    () => [
      { position: [-4.4, 0, -3.6], height: 9.2, rotation: [0.08, 0, 0.04] },
      { position: [4.9, 0, -4.8], height: 10.3, rotation: [-0.06, 0, -0.05] },
      { position: [-6.2, 0, 2.8], height: 8.1, rotation: [0.04, 0, -0.08] },
      { position: [3.1, 0, 4.9], height: 8.8, rotation: [-0.04, 0, 0.09] },
      { position: [0.8, 0, -6.1], height: 7.4, rotation: [0.09, 0, 0] },
    ],
    [],
  );

  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime;

    if (labGroupRef.current) {
      labGroupRef.current.position.y = Math.sin(elapsed * 0.38) * 0.18;
      labGroupRef.current.rotation.y = Math.sin(elapsed * 0.12) * 0.05;
    }

    ringRefs.current.forEach((ring, index) => {
      if (!ring) return;
      ring.rotation.x += 0.0016 + index * 0.00035;
      ring.rotation.y += 0.0024 - index * 0.00028;
      ring.position.y =
        6 + index * 1.2 + Math.sin(elapsed * 0.82 + index) * 0.22;
    });

    orbitNodesRef.current.forEach((node, index) => {
      if (!node) return;
      const angle = elapsed * (0.18 + index * 0.015) + index * 1.2;
      const radius = 2.4 + (index % 3) * 0.8;
      node.position.x = Math.cos(angle) * radius;
      node.position.z = Math.sin(angle) * radius;
      node.position.y =
        5.1 + index * 0.54 + Math.sin(elapsed * 0.9 + index) * 0.28;
    });

    if (coreShellRef.current) {
      coreShellRef.current.rotation.x = elapsed * 0.18;
      coreShellRef.current.rotation.y = elapsed * 0.28;
      coreShellRef.current.scale.setScalar(1 + Math.sin(elapsed * 1.3) * 0.04);
      coreShellRef.current.material.emissiveIntensity =
        0.18 + Math.sin(elapsed * 1.4) * 0.04;
    }

    if (coreGlowRef.current) {
      const glowPulse = 1 + Math.sin(elapsed * 1.6) * 0.08;
      coreGlowRef.current.scale.setScalar(glowPulse);
      coreGlowRef.current.material.emissiveIntensity =
        0.9 + Math.sin(elapsed * 1.8) * 0.16;
      coreGlowRef.current.material.color.copy(
        _color
          .setStyle("#ffd8a8")
          .lerp(new THREE.Color("#f0ae83"), 0.35 + Math.sin(elapsed) * 0.08),
      );
    }

    if (rearRingRef.current) {
      rearRingRef.current.rotation.z = elapsed * 0.08;
      rearRingRef.current.position.y = 8.6 + Math.sin(elapsed * 0.46) * 0.2;
    }

    if (beamGroupRef.current) {
      beamGroupRef.current.rotation.y = Math.sin(elapsed * 0.12) * 0.1;
      beamGroupRef.current.position.y = Math.sin(elapsed * 0.42) * 0.14;
    }
  });

  return (
    <group
      position={WHITE_PAVILION_WORLD_POSITION}
      scale={WHITE_PAVILION_SCALE}
    >
      <mesh position={[0, -0.32, 0]} material={plinthMaterial} receiveShadow>
        <cylinderGeometry args={[8.2, 9.8, 0.72, 36]} />
      </mesh>
      <mesh
        position={[0, 0.04, 0]}
        material={frameMaterial}
        castShadow
        receiveShadow
      >
        <torusGeometry args={[7.7, 0.26, 14, 64]} />
      </mesh>

      <group ref={labGroupRef} position={[0, 0.6, 0]}>
        <AmbientHalo />
        <LabDisplayScreen />

        {pillarData.map((pillar, index) => (
          <GlassPillar
            key={`glass-pillar-${index}`}
            position={pillar.position}
            height={pillar.height}
            rotation={pillar.rotation}
          />
        ))}

        <group position={[0, 5.8, 0]}>
          <mesh
            ref={rearRingRef}
            position={[0, 8.6, -3.8]}
            rotation={[Math.PI / 2, 0.16, 0]}
          >
            <torusGeometry args={[5.6, 0.12, 14, 80]} />
            <meshStandardMaterial
              color="#f6d6df"
              emissive="#d7839d"
              emissiveIntensity={0.16}
              roughness={0.42}
              metalness={0.04}
              transparent
              opacity={0.56}
            />
          </mesh>

          {[0, 1, 2].map((index) => (
            <mesh
              key={`ring-${index}`}
              ref={(node) => {
                ringRefs.current[index] = node;
              }}
              rotation={[
                index === 0 ? Math.PI / 2 : 0.76 + index * 0.28,
                index * 0.64,
                0.42 + index * 0.3,
              ]}
            >
              <torusGeometry
                args={[2.4 + index * 0.76, 0.1 + index * 0.02, 14, 72]}
              />
              <meshStandardMaterial
                color={index === 1 ? "#f0ae83" : "#ffd8a8"}
                emissive={index === 2 ? "#d7839d" : "#ffc08c"}
                emissiveIntensity={0.24}
                roughness={0.34}
                metalness={0.08}
                transparent
                opacity={0.88}
              />
            </mesh>
          ))}

          <mesh ref={coreShellRef} castShadow position={[0, 2, 0]}>
            <icosahedronGeometry args={[1.18, 2]} />
            <meshStandardMaterial
              color="#ffe7d2"
              emissive="#ffc08c"
              emissiveIntensity={0.18}
              roughness={0.22}
              metalness={0.02}
              transparent
              opacity={0.94}
            />
          </mesh>

          {/* <mesh ref={coreGlowRef}>
            <sphereGeometry args={[0.74, 24, 24]} />
            <meshStandardMaterial
              color="#0f0a05"
              emissive="#ffc08c"
              emissiveIntensity={0.92}
              roughness={0.16}
            />
          </mesh> */}

          {[0, 1, 2, 3].map((index) => (
            <group
              key={`orbit-node-${index}`}
              ref={(node) => {
                orbitNodesRef.current[index] = node;
              }}
            >
              <mesh>
                <sphereGeometry args={[0.24 + index * 0.04, 14, 14]} />
                <meshStandardMaterial
                  color={index % 2 === 0 ? "#ffd8a8" : "#f6d6df"}
                  emissive={index % 2 === 0 ? "#ffc08c" : "#d7839d"}
                  emissiveIntensity={0.5}
                  roughness={0.28}
                />
              </mesh>
            </group>
          ))}

          <ParticleField />
        </group>

        {nodeAnchors.map((anchor, index) => (
          <FloatingNode
            key={`floating-node-${index}`}
            position={anchor}
            size={0.22 + (index % 2) * 0.06}
            color={index % 3 === 0 ? "#f6d6df" : "#ffd8a8"}
            phase={index * 0.7}
          />
        ))}

        {connectorPairs.map((pair, index) => (
          <ConnectorLine
            key={`connector-${index}`}
            start={pair.start}
            end={pair.end}
            color={index % 2 === 0 ? "#ffd8a8" : "#f6d6df"}
          />
        ))}

        <group ref={beamGroupRef}>
          <BeamPlane
            position={[0, 7.8, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[8.5, 8.5, 1]}
            opacity={0.12}
          />
          <BeamPlane
            position={[0.2, 8.3, -0.2]}
            rotation={[-0.88, 0, 0]}
            scale={[4.2, 7.2, 1]}
            opacity={0.1}
          />
          <BeamPlane
            position={[-2.4, 8.9, 1.8]}
            rotation={[-0.78, 0.38, 0.24]}
            scale={[2.8, 5.2, 1]}
            opacity={0.08}
          />
        </group>
      </group>
    </group>
  );
}
