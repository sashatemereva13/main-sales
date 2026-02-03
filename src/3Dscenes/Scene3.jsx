// Scene3.jsx
import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import IridescentMaterial from "../shaders/Scene3Shader";

export default function Scene3() {
  const mesh = useRef();
  const mouse = useRef([0, 0]);
  const mouseTime = useRef(0);

  const { gl } = useThree();

  const updateMouse = (e) => {
    const x = e.clientX / window.innerWidth; // 0 to 1
    const y = 1 - e.clientY / window.innerHeight; // also 0 to 1 (flipped Y)
    mouse.current = [x, y];
    mouseTime.current = performance.now() / 1000;
  };

  useEffect(() => {
    window.addEventListener("pointermove", updateMouse);
    return () => window.removeEventListener("pointermove", updateMouse);
  }, [gl]);

  useFrame(({ clock }) => {
    const mat = mesh.current?.material;
    if (!mat) return;
    const t = clock.getElapsedTime();
    mat.uTime = t;
    mat.uMouse?.set(...mouse.current);
    mat.uMouseTime = mouseTime.current;
  });

  return (
    <mesh ref={mesh} rotation={[0, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[40, 10, 128, 128]} />
      <IridescentMaterial transparent side={THREE.DoubleSide} />
    </mesh>
  );
}
