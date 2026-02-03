// CanvasMiniScene.jsx
import { Canvas } from "@react-three/fiber";
import MiniScene from "./MiniScene";

export default function CanvasMiniScene() {
  return (
    <div className="canvas-layer">
      <Canvas
        camera={{ position: [0, 0, 14], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[2, 3, 4]} intensity={0.6} />

        <directionalLight position={[-3, -2, -4]} intensity={0.25} />

        {/* Atmospheric groups — peripheral, not focal */}
        <group position={[-3.2, -1, -0.6]}>
          <MiniScene />
        </group>

        <group position={[2, -0.8, 0.2]}>
          <MiniScene />
        </group>

        <group position={[0.4, 0.9, -0.4]}>
          <MiniScene />
        </group>
      </Canvas>
    </div>
  );
}
