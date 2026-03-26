import { Text } from "@react-three/drei";
import { WHITE_PAVILION_SCREEN_GROUP_POSITION } from "./constants";

export default function EntryScreen({ preserveGlass = true }) {
  return (
    <group position={WHITE_PAVILION_SCREEN_GROUP_POSITION}>
      <mesh position={[0, 0.92, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.12, 2.44, 0.34, 96]} />
        <meshStandardMaterial
          color="#f1f5f5"
          roughness={0.34}
          metalness={0.14}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>

      <mesh
        position={[0, 0.94, 0.22]}
        rotation={[Math.PI / 2, 0, 0]}
        renderOrder={2}
      >
        <cylinderGeometry args={[1.18, 1.36, 1.52, 96, 1, false, 0, Math.PI]} />
        <meshBasicMaterial
          color="#c8ffe1"
          transparent
          opacity={0.11}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 0.94, 0.3]} renderOrder={3}>
        <torusGeometry args={[1.28, 0.035, 28, 220]} />
        <meshBasicMaterial
          color="#dffff0"
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[-0.88, 0.96, 0.4]} renderOrder={3}>
        <boxGeometry args={[0.06, 1.46, 0.08]} />
        <meshBasicMaterial
          color="#9dffd0"
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 0.02, 0.14]}>
        <boxGeometry args={[2.32, 0.12, 0.3]} />
        <meshStandardMaterial
          color="#e8efee"
          roughness={0.46}
          metalness={0.08}
        />
      </mesh>

      <Text
        font="/fonts/Canobis.ttf"
        position={[0, 0.9, 0.4]}
        fontSize={0.6}
        maxWidth={1.2}
        letterSpacing={0.12}
        color="#113a20"
        anchorX="center"
        anchorY="middle"
        renderOrder={4}
      >
        Enter
      </Text>
    </group>
  );
}
