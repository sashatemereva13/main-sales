import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";
import BreathingAuraMaterial from "../shaders/Scene4Shader";

export default function Scene4() {
  const mesh = useRef();
  const scroll = useScroll();

  useFrame(({ clock }) => {
    const mat = mesh.current.material;
    mat.uTime = clock.getElapsedTime();
    mat.uScroll = scroll?.offset ?? 0;
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <planeGeometry args={[44, 40, 64, 64]} />
      <BreathingAuraMaterial transparent />
    </mesh>
  );
}
