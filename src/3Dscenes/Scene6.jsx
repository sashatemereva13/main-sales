// CrystalScene.jsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Sparkles, Environment } from "@react-three/drei";
import * as THREE from "three";

function FloatingCrystal() {
  return (
    <Float speed={1.5} floatIntensity={2} rotationIntensity={1.2}>
      <mesh>
        <icosahedronGeometry args={[1, 5]} />
        <meshPhysicalMaterial
          color="#A3F0FF"
          roughness={0.1}
          metalness={0.2}
          transmission={1}
          thickness={0.8}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>
    </Float>
  );
}

export default function Scene6() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      <color attach="background" args={["#141018"]} />
      <fog attach="fog" args={["#0a0a0a", 5, 12]} />

      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 3]} intensity={1.5} />

      <Sparkles count={50} size={2} scale={5} speed={0.5} color="#ffffff" />

      <FloatingCrystal />
      <OrbitControls enableZoom={false} />

      <Environment preset="sunset" />
    </Canvas>
  );
}
