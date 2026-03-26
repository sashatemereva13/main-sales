import { Text } from "@react-three/drei";
import { WHITE_PAVILION_SCREEN_GROUP_POSITION } from "./constants";

export default function EntryScreen({ preserveGlass = true }) {
  return (
    <group position={WHITE_PAVILION_SCREEN_GROUP_POSITION}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.88, -0.22]}>
        <cylinderGeometry args={[1.42, 1.78, 0.54, 80]} />
        <meshStandardMaterial
          color="#57cd57"
          roughness={0.42}
          metalness={0.1}
        />
      </mesh>

      <mesh position={[0, 0.76, 0.3]}>
        <torusGeometry args={[0.92, 0.04, 28, 180]} />
        <meshBasicMaterial color="#e6ffee" transparent opacity={0.3} />
      </mesh>

      <Text
        font="/fonts/Canobis.ttf"
        position={[0, 0.8, 0.48]}
        fontSize={0.4}
        maxWidth={1.5}
        letterSpacing={0.08}
        color="#f4fff8"
        anchorX="center"
        anchorY="middle"
      >
        Enter
      </Text>
    </group>
  );
}
