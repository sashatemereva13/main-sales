import { Text } from "@react-three/drei";
import { WHITE_PAVILION_WORLD_POSITION } from "../summerscene/WhitePavilion";

export default function HeroTitle() {
  const [pavilionX, pavilionY, pavilionZ] = WHITE_PAVILION_WORLD_POSITION;

  return (
    <Text
      font="/fonts/Canobis.ttf"
      position={[pavilionX, pavilionY + 6.8, pavilionZ + 9.5]}
      fontSize={6}
      letterSpacing={0.05}
      maxWidth={60}
      lineHeight={1}
      textAlign="center"
      color="#e6a597"
      anchorX="center"
      anchorY="middle"
      castShadow
    >
      amber composition lab
    </Text>
  );
}
