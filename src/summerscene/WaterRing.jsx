import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  MEADOW_ISLAND_CENTER,
  WATER_RING_INNER_RADIUS,
  WATER_RING_OUTER_RADIUS,
} from "./meadowIslandConfig";
import { sampleVisibleTerrainHeight } from "./terrainSurface";

function buildRingShape(outerRadiusX, outerRadiusZ, innerRadiusX, innerRadiusZ) {
  const shape = new THREE.Shape();
  shape.absellipse(0, 0, outerRadiusX, outerRadiusZ, 0, Math.PI * 2, false, 0);
  const hole = new THREE.Path();
  hole.absellipse(0, 0, innerRadiusX, innerRadiusZ, 0, Math.PI * 2, true, 0);
  shape.holes.push(hole);
  return shape;
}

export default function WaterRing({
  center = MEADOW_ISLAND_CENTER,
  innerRadiusX = WATER_RING_INNER_RADIUS.x,
  innerRadiusZ = WATER_RING_INNER_RADIUS.z,
  outerRadiusX = WATER_RING_OUTER_RADIUS.x,
  outerRadiusZ = WATER_RING_OUTER_RADIUS.z,
}) {
  const materialRef = useRef();
  const baseHeight = sampleVisibleTerrainHeight(center[0], center[1]);
  const shoreY = baseHeight - 1.55;
  const waterY = shoreY + 1.06;

  const shoreShape = useMemo(
    () =>
      buildRingShape(
        outerRadiusX + 2.2,
        outerRadiusZ + 2.2,
        innerRadiusX - 1.2,
        innerRadiusZ - 1.2,
      ),
    [innerRadiusX, innerRadiusZ, outerRadiusX, outerRadiusZ],
  );
  const waterShape = useMemo(
    () => buildRingShape(outerRadiusX, outerRadiusZ, innerRadiusX, innerRadiusZ),
    [innerRadiusX, innerRadiusZ, outerRadiusX, outerRadiusZ],
  );

  const shoreGeometry = useMemo(() => {
    const geo = new THREE.ShapeGeometry(shoreShape, 96);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [shoreShape]);

  const waterGeometry = useMemo(() => {
    const geo = new THREE.ShapeGeometry(waterShape, 96);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [waterShape]);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <group position={[center[0], 0, center[1]]}>
      <mesh geometry={shoreGeometry} position={[0, shoreY, 0]} receiveShadow renderOrder={1}>
        <meshStandardMaterial
          color="#927f63"
          roughness={0.98}
          metalness={0}
          emissive="#5c4938"
          emissiveIntensity={0.08}
        />
      </mesh>

      <mesh geometry={waterGeometry} position={[0, waterY, 0]} renderOrder={2}>
        <shaderMaterial
          ref={materialRef}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          uniforms={{
            uTime: { value: 0 },
            uDeep: { value: new THREE.Color("#315d75") },
            uShallow: { value: new THREE.Color("#6cb8c8") },
            uGlow: { value: new THREE.Color("#d8f0ef") },
            uSparkle: { value: new THREE.Color("#ffe7b0") },
          }}
          vertexShader={`
            varying vec2 vLocal;
            uniform float uTime;

            void main() {
              vLocal = position.xz;
              vec3 pos = position;
              float rippleA = sin(pos.x * 0.32 + pos.z * 0.24 - uTime * 1.2) * 0.12;
              float rippleB = sin(pos.x * -0.41 + pos.z * 0.35 + uTime * 1.45) * 0.08;
              pos.y += rippleA + rippleB;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
          `}
          fragmentShader={`
            varying vec2 vLocal;
            uniform float uTime;
            uniform vec3 uDeep;
            uniform vec3 uShallow;
            uniform vec3 uGlow;
            uniform vec3 uSparkle;

            void main() {
              float angle = atan(vLocal.y, vLocal.x);
              float ringNoise =
                sin(angle * 7.0 + uTime * 0.55) * 0.5 +
                sin(angle * 13.0 - uTime * 0.42) * 0.25;
              float shimmer = sin(vLocal.x * 0.45 + vLocal.y * 0.28 - uTime * 1.7) * 0.5 + 0.5;
              float depthMix = smoothstep(0.15, 0.85, fract(length(vLocal) * 0.038 + ringNoise * 0.02));

              vec3 color = mix(uShallow, uDeep, depthMix * 0.7);
              color = mix(color, uGlow, shimmer * 0.16);

              float sparkle = pow(shimmer, 8.0) * 0.9;
              color += uSparkle * sparkle * 0.2;

              gl_FragColor = vec4(color, 0.82);
            }
          `}
        />
      </mesh>
    </group>
  );
}
