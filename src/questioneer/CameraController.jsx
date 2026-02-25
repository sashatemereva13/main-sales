import { useThree, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function CameraController({
  target,
  introStart = [0, 24, 70],
  introDuration = 2.8,
  lookAt = [0, 1.5, 0],
  onIntroComplete,
}) {
  const { camera } = useThree();
  const targetVec = useRef(new THREE.Vector3(...target));
  const lookAtVec = useRef(new THREE.Vector3(...lookAt));
  const introStartVec = useRef(new THREE.Vector3(...introStart));
  const introStartedAt = useRef(null);
  const introDone = useRef(false);
  const introCompleteCalled = useRef(false);

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  useFrame(({ clock }) => {
    targetVec.current.set(...target);
    lookAtVec.current.set(...lookAt);

    if (!introDone.current) {
      if (introStartedAt.current == null) {
        introStartedAt.current = clock.elapsedTime;
        camera.position.copy(introStartVec.current);
      }

      const elapsed = clock.elapsedTime - introStartedAt.current;
      const t = Math.min(elapsed / introDuration, 1);
      const eased = easeOutCubic(t);

      camera.position.lerpVectors(introStartVec.current, targetVec.current, eased);
      camera.lookAt(lookAtVec.current);

      if (t >= 1) {
        introDone.current = true;
        if (!introCompleteCalled.current) {
          introCompleteCalled.current = true;
          onIntroComplete?.();
        }
      }

      return;
    }

    camera.position.lerp(targetVec.current, 0.05);
    camera.lookAt(lookAtVec.current);
  });

  return null;
}
