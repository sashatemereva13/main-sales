import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { computeIntroCameraPose } from "../intro/introCameraMath";

export default function CameraController({
  target,
  introStart = [0, 24, 70],
  introDuration = 2.8,
  introProgress,
  lookAt = [0, 1.5, 0],
  introLookAtStart = lookAt,
  introOrbitTurns = 0,
  introOrbitStart = 0,
  introOrbitUntil = 0.6,
  skipIntro = false,
  onIntroFrame,
  onIntroComplete,
}) {
  const { camera } = useThree();
  const targetVec = useRef(new THREE.Vector3(...target));
  const lookAtVec = useRef(new THREE.Vector3(...lookAt));
  const introLookAtStartVec = useRef(new THREE.Vector3(...introLookAtStart));
  const introLookAtCurrentVec = useRef(new THREE.Vector3(...introLookAtStart));
  const introStartVec = useRef(new THREE.Vector3(...introStart));
  const introStartedAt = useRef(null);
  const introDone = useRef(false);
  const introCompleteCalled = useRef(false);
  const lastDebugEmitAt = useRef(-Infinity);
  const hasControlledProgress = typeof introProgress === "number";

  useEffect(() => {
    if (!skipIntro || introDone.current) return;

    introDone.current = true;
    introStartedAt.current = 0;
    if (!introCompleteCalled.current) {
      introCompleteCalled.current = true;
      onIntroComplete?.();
    }
  }, [skipIntro, onIntroComplete]);

  useFrame(({ clock }) => {
    targetVec.current.set(...target);
    lookAtVec.current.set(...lookAt);
    introLookAtStartVec.current.set(...introLookAtStart);

    if (!introDone.current) {
      if (introStartedAt.current == null) {
        introStartedAt.current = clock.elapsedTime;
        camera.position.copy(introStartVec.current);
      }

      const elapsed = clock.elapsedTime - introStartedAt.current;
      const controlledT = Math.min(Math.max(introProgress ?? 0, 0), 1);
      const t = hasControlledProgress
        ? controlledT
        : Math.min(elapsed / introDuration, 1);
      const pose = computeIntroCameraPose({
        t,
        introStart,
        target,
        introLookAtStart,
        lookAt,
        introOrbitTurns,
        introOrbitStart,
        introOrbitUntil,
      });

      camera.position.copy(pose.position);
      introLookAtCurrentVec.current.copy(pose.lookAt);
      camera.lookAt(introLookAtCurrentVec.current);
      if (onIntroFrame && clock.elapsedTime - lastDebugEmitAt.current > 0.08) {
        lastDebugEmitAt.current = clock.elapsedTime;
        onIntroFrame({
          phase: "intro",
          elapsed: hasControlledProgress ? t * introDuration : elapsed,
          progress: t,
          easedProgress: pose.eased,
          orbitAngleRad: pose.orbitAngle,
          cameraPosition: [
            camera.position.x,
            camera.position.y,
            camera.position.z,
          ],
          cameraRotation: [camera.rotation.x, camera.rotation.y, camera.rotation.z],
          lookAt: [
            introLookAtCurrentVec.current.x,
            introLookAtCurrentVec.current.y,
            introLookAtCurrentVec.current.z,
          ],
          target: [targetVec.current.x, targetVec.current.y, targetVec.current.z],
        });
      }

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
    if (onIntroFrame && clock.elapsedTime - lastDebugEmitAt.current > 0.12) {
      lastDebugEmitAt.current = clock.elapsedTime;
      onIntroFrame({
        phase: "follow",
        elapsed: null,
        progress: 1,
        easedProgress: 1,
        orbitAngleRad: 0,
        cameraPosition: [camera.position.x, camera.position.y, camera.position.z],
        cameraRotation: [camera.rotation.x, camera.rotation.y, camera.rotation.z],
        lookAt: [lookAtVec.current.x, lookAtVec.current.y, lookAtVec.current.z],
        target: [targetVec.current.x, targetVec.current.y, targetVec.current.z],
      });
    }
  });

  return null;
}
