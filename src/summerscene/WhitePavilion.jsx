import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sampleVisibleTerrainHeight } from "./terrainSurface";

export const WHITE_PAVILION_CENTER = Object.freeze([40, -27]);
export const WHITE_PAVILION_BASE_Y =
  sampleVisibleTerrainHeight(
    WHITE_PAVILION_CENTER[0],
    WHITE_PAVILION_CENTER[1],
  ) - 0.35;
export const WHITE_PAVILION_SCALE = Object.freeze([2.18, 2.3, 2.18]);
export const WHITE_PAVILION_WORLD_POSITION = Object.freeze([
  WHITE_PAVILION_CENTER[0],
  WHITE_PAVILION_BASE_Y,
  WHITE_PAVILION_CENTER[1],
]);
export const WHITE_PAVILION_LOOK_AT_POSITION = Object.freeze([
  WHITE_PAVILION_CENTER[0] + 10,
  WHITE_PAVILION_BASE_Y + 34,
  WHITE_PAVILION_CENTER[1],
]);
export const WHITE_PAVILION_SWIRL_POSITION = Object.freeze([
  WHITE_PAVILION_CENTER[0],
  WHITE_PAVILION_BASE_Y + 89,
  WHITE_PAVILION_CENTER[1],
]);

function Column({ position, height = 11.5, material }) {
  return (
    <group position={position}>
      <mesh
        position={[0, 0.45, 0]}
        material={material}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.9, 1.15, 0.9, 24]} />
      </mesh>
      <mesh
        position={[0, height * 0.5 + 0.8, 0]}
        material={material}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.48, 0.62, height, 24]} />
      </mesh>
      <mesh
        position={[0, height + 1.1, 0]}
        material={material}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[1.05, 0.76, 1.2, 24]} />
      </mesh>
    </group>
  );
}

function Planter({ position, scale = 1, material, flowerColor = "#ffd9e7" }) {
  return (
    <group position={position} scale={scale}>
      <mesh material={material} castShadow receiveShadow>
        <cylinderGeometry args={[1.25, 0.78, 1.45, 28]} />
      </mesh>
      <group position={[0, 0.92, 0]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1.18, 18, 18]} />
          <meshStandardMaterial color="#6d7d32" roughness={1} />
        </mesh>
        <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.72, 18, 18]} />
          <meshStandardMaterial color={flowerColor} roughness={0.98} />
        </mesh>
      </group>
    </group>
  );
}

function Cascade({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.4, 0]} rotation={[-0.88, 0, 0]} renderOrder={3}>
        <planeGeometry args={[1.8, 4.2]} />
        <meshBasicMaterial
          color="#dff6f6"
          transparent
          opacity={0.58}
          depthWrite={false}
        />
      </mesh>
      <mesh
        position={[0, -0.38, 1.68]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={3}
      >
        <circleGeometry args={[1.35, 36]} />
        <meshBasicMaterial
          color="#cbe8ea"
          transparent
          opacity={0.34}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function FlowerCrown({ material, vineRefs }) {
  const bunches = useMemo(
    () => [
      {
        angle: 0.18,
        radius: 6.1,
        y: 15.1,
        scale: [2.2, 0.9, 1.5],
        color: "#f6d6df",
      },
      {
        angle: 0.92,
        radius: 5.6,
        y: 15.5,
        scale: [1.8, 1.1, 1.4],
        color: "#fff1dc",
      },
      {
        angle: 1.78,
        radius: 6.2,
        y: 15.2,
        scale: [2.1, 1, 1.5],
        color: "#fbd6ea",
      },
      {
        angle: 2.62,
        radius: 5.9,
        y: 15.45,
        scale: [1.9, 0.95, 1.45],
        color: "#f6ebce",
      },
      {
        angle: 3.56,
        radius: 6.15,
        y: 15.15,
        scale: [2.3, 1.1, 1.55],
        color: "#ffe0e8",
      },
      {
        angle: 4.4,
        radius: 5.7,
        y: 15.55,
        scale: [1.85, 1, 1.35],
        color: "#fff4e3",
      },
      {
        angle: 5.22,
        radius: 6.05,
        y: 15.22,
        scale: [2.05, 0.96, 1.48],
        color: "#f7d4df",
      },
    ],
    [],
  );

  return (
    <>
      <mesh position={[0, 15.05, 0]} castShadow receiveShadow>
        <torusGeometry args={[5.8, 0.7, 18, 56]} />
        <meshStandardMaterial color="#7a8737" roughness={1} />
      </mesh>
      {bunches.map((bunch, index) => (
        <mesh
          key={`crown-${index}`}
          position={[
            Math.cos(bunch.angle) * bunch.radius,
            bunch.y,
            Math.sin(bunch.angle) * bunch.radius,
          ]}
          scale={bunch.scale}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={bunch.color} roughness={0.98} />
        </mesh>
      ))}

      {bunches.map((bunch, index) => (
        <group
          key={`vine-${index}`}
          position={[
            Math.cos(bunch.angle + 0.18) * 5.2,
            14.3,
            Math.sin(bunch.angle + 0.18) * 5.2,
          ]}
          rotation={[0, bunch.angle, 0]}
          ref={(node) => {
            vineRefs.current[index] = node;
          }}
        >
          <mesh
            position={[0, -3.3 - (index % 2) * 0.7, 0]}
            rotation={[0.16, 0, 0]}
            castShadow
            receiveShadow
          >
            <capsuleGeometry args={[0.08, 6.4, 6, 10]} />
            <meshStandardMaterial color="#7c8b3f" roughness={1} />
          </mesh>
        </group>
      ))}
    </>
  );
}

export default function WhitePavilion() {
  const vineRefs = useRef([]);
  const stoneMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f2ece2",
        roughness: 0.94,
        metalness: 0,
      }),
    [],
  );

  const columnOffsets = useMemo(
    () => [
      [-4.8, 0, -4.8],
      [4.8, 0, -4.8],
      [-4.8, 0, 4.8],
      [4.8, 0, 4.8],
      [0, 0, -6],
      [0, 0, 6],
    ],
    [],
  );

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;

    vineRefs.current.forEach((group, index) => {
      if (!group) return;
      const phase = elapsed * 0.88 + index * 0.72;
      group.rotation.z = Math.sin(phase) * 0.06;
      group.rotation.x = Math.cos(phase * 0.76) * 0.02;
    });
  });

  return (
    <group
      position={WHITE_PAVILION_WORLD_POSITION}
      scale={WHITE_PAVILION_SCALE}
    >
      <mesh
        position={[0, 0.4, 0]}
        material={stoneMaterial}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[8.2, 8.8, 0.8, 44]} />
      </mesh>

      <mesh
        position={[0, -0.45, 0]}
        material={stoneMaterial}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[9.4, 9.9, 0.95, 44]} />
      </mesh>

      {columnOffsets.map((offset, index) => (
        <Column
          key={`column-${index}`}
          position={offset}
          material={stoneMaterial}
        />
      ))}

      <mesh
        position={[0, 13.35, 0]}
        material={stoneMaterial}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[7.6, 7.9, 1.05, 44]} />
      </mesh>

      <mesh
        position={[0, 14.2, 0]}
        material={stoneMaterial}
        castShadow
        receiveShadow
      >
        <torusGeometry args={[6.5, 1.15, 18, 44]} />
      </mesh>

      <mesh
        position={[0, 15.2, 0]}
        material={stoneMaterial}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[6.8, 5.8, 1.3, 44]} />
      </mesh>

      <mesh
        position={[0, 1.7, 0]}
        material={stoneMaterial}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[2.3, 2.8, 2.2, 28]} />
      </mesh>
      <mesh
        position={[0, 3.05, 0]}
        material={stoneMaterial}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[1.55, 2.1, 0.9, 28]} />
      </mesh>

      <mesh
        position={[0, 0.4, 8.9]}
        material={stoneMaterial}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[6.8, 0.8, 4.2]} />
      </mesh>
      <mesh
        position={[0, -0.15, 11.6]}
        material={stoneMaterial}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[5.2, 0.72, 3.2]} />
      </mesh>
      <mesh
        position={[0, -0.68, 13.8]}
        material={stoneMaterial}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[3.6, 0.62, 2.5]} />
      </mesh>

      <Cascade position={[0, -1.4, 13.35]} />

      <Planter
        position={[-7.8, 0.35, 7.6]}
        scale={1.1}
        material={stoneMaterial}
      />
      <Planter
        position={[7.9, 0.35, 6.4]}
        scale={1.05}
        material={stoneMaterial}
        flowerColor="#fff0d7"
      />
      <Planter
        position={[-5.4, -0.1, 12.2]}
        scale={0.88}
        material={stoneMaterial}
        flowerColor="#ffcfde"
      />
      <Planter
        position={[5.2, -0.36, 13.4]}
        scale={0.8}
        material={stoneMaterial}
        flowerColor="#ffe5ec"
      />

      <FlowerCrown material={stoneMaterial} vineRefs={vineRefs} />
    </group>
  );
}
