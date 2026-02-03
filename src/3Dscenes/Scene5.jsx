// components/Scene5CrystalGarden.jsx
import { useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  Sparkles,
  Float,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";

function Plant({ position }) {
  const [scale, setScale] = useState(0);
  useFrame((_, delta) => {
    if (scale < 1) setScale((prev) => Math.min(prev + delta * 0.8, 1));
  });

  const plantType = Math.floor(Math.random() * 3);

  // pastel-crystal color palette
  const pastelColors = ["#A3F0FF", "#FFD1DC", "#E1E3FF", "#C4FFE7"];
  const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];

  return (
    <group scale={[scale, scale, scale]} position={position}>
      {plantType === 0 && (
        <mesh>
          <cylinderGeometry args={[0.1, 0.1, 1.2, 8]} />
          <meshPhysicalMaterial
            color={color}
            roughness={0.2}
            metalness={0.2}
            transmission={0.4}
            clearcoat={1}
            opacity={0.8}
            transparent
          />
        </mesh>
      )}
      {plantType === 1 && (
        <mesh position={[0, 0.5, 0]}>
          <coneGeometry args={[0.3, 1, 6]} />
          <meshPhysicalMaterial
            color={color}
            roughness={0.05}
            metalness={0.1}
            sheen={1}
            clearcoat={1}
            transmission={0.5}
            opacity={0.8}
            transparent
          />
        </mesh>
      )}
      {plantType === 2 && (
        <group>
          <mesh position={[0, 0.6, 0]}>
            <sphereGeometry args={[0.5, 24, 24]} />
            <meshPhysicalMaterial
              color={color}
              roughness={0.1}
              metalness={0.3}
              transmission={0.7}
              clearcoat={1}
              opacity={0.8}
              transparent
            />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
            <meshStandardMaterial color="#6AFFA9" roughness={0.3} />
          </mesh>
        </group>
      )}
    </group>
  );
}

export default function Scene5CrystalGarden() {
  const [plants, setPlants] = useState([]);

  return (
    <Canvas camera={{ position: [0, 3, 10], fov: 55 }}>
      <color attach="background" args={["#141018"]} />
      <fog attach="fog" args={["#141018", 10, 25]} />

      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />

      <Sparkles count={40} size={2} scale={20} speed={1} color="#ffffff" />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onPointerDown={(e) => {
          e.stopPropagation();
          const { x, z } = e.point;
          setPlants((prev) => [
            ...prev,
            { id: Date.now(), position: [x, 0, z] },
          ]);
        }}
      >
        <Html>
          <div
            style={{
              color: "#C4C7E6",
              fontSize: "1rem",
              width: "500px",
              right: "-10rem",
              top: "5rem",
              position: "fixed",
            }}
          >
            Tap anywhere to plant a tree
          </div>
        </Html>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#9A7BB9" />
      </mesh>

      {plants.map((plant) => (
        <Plant key={plant.id} position={plant.position} />
      ))}

      <OrbitControls enableZoom={false} />
      <Environment preset="sunset" />
    </Canvas>
  );
}
