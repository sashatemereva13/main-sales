import { useFrame } from "@react-three/fiber";

export default function usePavilionAnimation({
  towerRef,
  crownRef,
  glowRingRef,
  terraceClusterRef,
}) {
  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime;

    if (towerRef.current) {
      towerRef.current.position.y = Math.sin(elapsed * 0.34) * 0.1;
      towerRef.current.rotation.y = Math.sin(elapsed * 0.12) * 0.03;
    }
    if (crownRef.current) {
      crownRef.current.rotation.y = elapsed * 0.06;
      crownRef.current.position.y = 18.5 + Math.sin(elapsed * 0.8) * 0.12;
    }
    if (glowRingRef.current) {
      glowRingRef.current.material.opacity = 0.22 + Math.sin(elapsed * 1.4) * 0.05;
      glowRingRef.current.scale.setScalar(1 + Math.sin(elapsed * 1.2) * 0.03);
    }
    if (terraceClusterRef.current) {
      terraceClusterRef.current.rotation.y = Math.sin(elapsed * 0.09) * 0.025;
      terraceClusterRef.current.position.y = Math.sin(elapsed * 0.42) * 0.06;
    }
  });
}
