import { Text } from "@react-three/drei";

export default function HeroTitle() {
  return (
    <Text
      font="/fonts/Canobis.ttf"
      position={[0, 2.5, -5]}
      fontSize={1.2}
      letterSpacing={0.05}
      maxWidth={20}
      lineHeight={1}
      textAlign="center"
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      castShadow
    >
      Sasha13Studio
    </Text>
  );
}
