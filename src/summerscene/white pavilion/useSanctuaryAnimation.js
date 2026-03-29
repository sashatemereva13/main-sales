import { useFrame } from "@react-three/fiber";

export default function useSanctuaryAnimation({
  crownRef,
  portalGlowRef,
}) {
  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime;

    if (portalGlowRef.current) {
      const opacity = 0.24 + Math.sin(elapsed * 1.25) * 0.08;
      portalGlowRef.current.material.opacity = opacity;
      const scale = 1 + Math.sin(elapsed * 0.95) * 0.05;
      portalGlowRef.current.scale.setScalar(scale);
    }

    if (crownRef.current) {
      crownRef.current.rotation.y = Math.sin(elapsed * 0.14) * 0.02;
      crownRef.current.position.y = Math.sin(elapsed * 0.42) * 0.12;
    }
  });
}
