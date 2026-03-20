import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const MAX_TILT_X = 0.045;
const MAX_TILT_Y = 0.07;
const FOLLOW_EASE = 0.075;

export default function SceneParallaxRig({
  children,
  disabled = false,
  intensity = 1,
}) {
  const groupRef = useRef(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const { pointer } = useThree();

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    if (disabled) {
      targetRotation.current.x = 0;
      targetRotation.current.y = 0;
    } else {
      targetRotation.current.x = pointer.y * MAX_TILT_X * intensity;
      targetRotation.current.y = pointer.x * MAX_TILT_Y * intensity;
    }

    group.rotation.x = THREE.MathUtils.lerp(
      group.rotation.x,
      targetRotation.current.x,
      FOLLOW_EASE,
    );
    group.rotation.y = THREE.MathUtils.lerp(
      group.rotation.y,
      targetRotation.current.y,
      FOLLOW_EASE,
    );
  });

  return <group ref={groupRef}>{children}</group>;
}
