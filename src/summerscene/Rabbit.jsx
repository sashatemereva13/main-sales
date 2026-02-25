// Rabbit.jsx
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";

const POND_ZONE = {
  centerX: 18,
  centerZ: -18,
  radiusX: 15.5,
  radiusZ: 11.5,
};

export default function Rabbit({ position = [0, 0, 0] }) {
  const rootRef = useRef();
  const visualRef = useRef();

  const { scene } = useGLTF("/glb/rabbit.glb");

  // ✅ rig-safe clone (critical for Armature/SkinnedMesh)
  const rabbitScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // Motion params (unique per component instance)
  const phase = useRef(Math.random() * Math.PI * 2);
  const hopFreq = useRef(1.2 + Math.random() * 0.4);
  const speed = useRef(0.8 + Math.random() * 0.3);
  const hopAmp = useRef(0.25 + Math.random() * 0.15);
  const yawOffset = useRef((Math.random() - 0.5) * 0.2);
  const baseScale = useRef(0.65 + Math.random() * 0.15);
  const roamRadius = useRef(9 + Math.random() * 9);
  const heading = useRef(Math.random() * Math.PI * 2);
  const currentSpeed = useRef(0);
  const hopClock = useRef(Math.random() * 6);
  const moveState = useRef({
    moving: true,
    timer: 1.4 + Math.random() * 2.0,
    targetSpeed: 0.45 + Math.random() * 0.35,
    turnBias: (Math.random() - 0.5) * 0.45,
  });

  // ✅ store base position per rabbit (and update if prop changes)
  const basePos = useRef({ x: position[0], y: position[1], z: position[2] });

  useEffect(() => {
    basePos.current = { x: position[0], y: position[1], z: position[2] };
    if (rootRef.current) {
      rootRef.current.position.set(position[0], position[1], position[2]);
    }
  }, [position]);

  useEffect(() => {
    rabbitScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.frustumCulled = false; // optional safety
      }
    });
  }, [rabbitScene]);

  useFrame(({ clock }, delta) => {
    if (!rootRef.current || !visualRef.current) return;

    const base = basePos.current;
    const state = moveState.current;

    state.timer -= delta;
    if (state.timer <= 0) {
      state.moving = !state.moving;
      if (state.moving) {
        state.timer = 1.2 + Math.random() * 2.6;
        state.targetSpeed = speed.current * (0.65 + Math.random() * 0.65);
        state.turnBias = (Math.random() - 0.5) * 0.65;
      } else {
        state.timer = 0.45 + Math.random() * 1.6;
        state.targetSpeed = 0;
      }
    }

    const pos = rootRef.current.position;
    const toHomeX = base.x - pos.x;
    const toHomeZ = base.z - pos.z;
    const homeDist = Math.hypot(toHomeX, toHomeZ);
    const homeAngle = Math.atan2(toHomeZ, toHomeX);

    let angleDelta = homeAngle - heading.current;
    angleDelta = Math.atan2(Math.sin(angleDelta), Math.cos(angleDelta));

    const drift = Math.sin((clock.elapsedTime + phase.current) * 0.33) * 0.12;
    const homeSteer = homeDist > roamRadius.current ? angleDelta * 1.9 : 0;
    let pondSteer = 0;

    const dxPond = pos.x - POND_ZONE.centerX;
    const dzPond = pos.z - POND_ZONE.centerZ;
    const nx = dxPond / POND_ZONE.radiusX;
    const nz = dzPond / POND_ZONE.radiusZ;
    const pondNormDist = Math.sqrt(nx * nx + nz * nz);

    if (pondNormDist < 1.45) {
      const awayAngle = Math.atan2(dzPond, dxPond);
      let pondAngleDelta = awayAngle - heading.current;
      pondAngleDelta = Math.atan2(Math.sin(pondAngleDelta), Math.cos(pondAngleDelta));
      const pondFalloff = 1 - smoothStep(1.0, 1.45, pondNormDist);
      pondSteer = pondAngleDelta * (1.8 + pondFalloff * 1.6);

      // Slightly reduce target speed while near the pond edge so turning looks natural.
      state.targetSpeed *= 1 - pondFalloff * 0.25;
    }

    heading.current += (drift + state.turnBias * 0.12 + homeSteer + pondSteer) * delta;

    currentSpeed.current = THREE.MathUtils.damp(
      currentSpeed.current,
      state.targetSpeed,
      state.moving ? 2.5 : 4.0,
      delta,
    );

    pos.x += Math.cos(heading.current) * currentSpeed.current * delta;
    pos.z += Math.sin(heading.current) * currentSpeed.current * delta;

    // Emergency push-out if a rabbit still penetrates the pond ellipse.
    const dxNow = pos.x - POND_ZONE.centerX;
    const dzNow = pos.z - POND_ZONE.centerZ;
    const nxNow = dxNow / POND_ZONE.radiusX;
    const nzNow = dzNow / POND_ZONE.radiusZ;
    const pondNow = Math.sqrt(nxNow * nxNow + nzNow * nzNow);
    if (pondNow < 1.0) {
      const safe = 1.02 / Math.max(pondNow, 0.0001);
      pos.x = POND_ZONE.centerX + dxNow * safe;
      pos.z = POND_ZONE.centerZ + dzNow * safe;
      heading.current += (Math.random() - 0.5) * 0.2;
      currentSpeed.current *= 0.85;
    }

    const speedNorm = THREE.MathUtils.clamp(
      currentSpeed.current / Math.max(speed.current, 0.001),
      0,
      1,
    );

    hopClock.current += delta * hopFreq.current * (0.2 + speedNorm);
    const hopPhase = hopClock.current + phase.current;
    const cycle = (Math.sin(hopPhase) + 1) * 0.5;
    const moveGate = smoothStep(0.08, 0.22, speedNorm);
    const jump = Math.pow(cycle, 1.9) * hopAmp.current * moveGate;
    const stride = Math.sin(hopPhase + Math.PI * 0.15) * moveGate;
    const landingPulse = Math.sin(hopPhase * 2.0) * 0.016 * moveGate;

    pos.y = base.y + jump;

    rootRef.current.rotation.y =
      heading.current + yawOffset.current + Math.sin(hopPhase * 0.25) * 0.03;

    visualRef.current.position.y = landingPulse;
    visualRef.current.rotation.x = -0.02 + stride * 0.08 + speedNorm * 0.03;
    visualRef.current.rotation.z = Math.sin(hopPhase) * 0.02 * moveGate;

    visualRef.current.scale.set(
      baseScale.current * (1 + cycle * 0.045 * moveGate),
      baseScale.current * (1 - cycle * 0.055 * moveGate + (1 - moveGate) * 0.01),
      baseScale.current * (1 + cycle * 0.02 * moveGate),
    );
  });

  return (
    <group ref={rootRef}>
      <group ref={visualRef} rotation={[0, Math.PI / 2, 0]}>
        <primitive object={rabbitScene} />
      </group>
    </group>
  );
}

useGLTF.preload("/glb/rabbit.glb");

function smoothStep(edge0, edge1, x) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}
