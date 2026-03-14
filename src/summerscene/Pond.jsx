import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sampleVisibleTerrainHeight } from "./terrainSurface";

export default function Pond({
  center = [18, -18],
  radiusX = 10,
  radiusZ = 10,
}) {
  const materialRef = useRef();
  const ringY = sampleVisibleTerrainHeight(center[0], center[1]) - 1.22;
  const waterY = ringY + 1.4;

  const shoreShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absellipse(
      0,
      0,
      radiusX * 0.9,
      radiusZ * 0.99,
      0,
      Math.PI * 2,
      false,
      0,
    );
    const hole = new THREE.Path();
    hole.absellipse(0, 0, radiusX, radiusZ, 0, Math.PI * 2, false, 0);
    shape.holes.push(hole);
    return shape;
  }, [radiusX, radiusZ]);

  const shoreGeometry = useMemo(() => {
    const geo = new THREE.ShapeGeometry(shoreShape, 64);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [shoreShape]);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <group position={[center[0], 0, center[1]]}>
      <mesh
        geometry={shoreGeometry}
        position={[0, ringY, 0]}
        renderOrder={1}
        receiveShadow
      >
        <meshStandardMaterial
          color="#8a7758"
          roughness={0.98}
          metalness={0}
          emissive="#4e3f2d"
          emissiveIntensity={0.08}
        />
      </mesh>

      <mesh
        position={[0, waterY, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[radiusX, radiusZ, 1]}
        renderOrder={2}
      >
        <circleGeometry args={[1, 96]} />
        <shaderMaterial
          ref={materialRef}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          uniforms={{
            uTime: { value: 0 },
            uDeep: { value: new THREE.Color("#3d8db0") },
            uShallow: { value: new THREE.Color("#79d2e2") },
            uHorizonTint: { value: new THREE.Color("#b6eff3") },
            uSparkle: { value: new THREE.Color("#fff1c5") },
          }}
          vertexShader={`
            varying vec2 vUv;
            uniform float uTime;
            void main() {
              vUv = uv;
              vec3 pos = position;
              float r = length(pos.xy);
              float rippleA = sin((pos.x * 11.0 + pos.y * 7.0) - uTime * 1.45) * 0.008;
              float rippleB = sin((pos.x * -17.0 + pos.y * 13.0) + uTime * 1.1) * 0.0055;
              float rippleC = sin(r * 34.0 - uTime * 2.1) * 0.0045;
              float ripple = rippleA + rippleB + rippleC;
              pos.z += ripple * smoothstep(1.0, 0.08, r);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
          `}
          fragmentShader={`
            varying vec2 vUv;
            uniform float uTime;
            uniform vec3 uDeep;
            uniform vec3 uShallow;
            uniform vec3 uHorizonTint;
            uniform vec3 uSparkle;

            void main() {
              vec2 p = vUv - 0.5;
              float r = length(p) * 2.0;
              if (r > 1.0) discard;

              float edge = smoothstep(1.0, 0.8, r);
              float shoreGlow = smoothstep(0.98, 0.62, r);
              float depthMix = smoothstep(0.08, 0.95, r);

              float wave1 = sin((p.x * 42.0 + p.y * 28.0) - uTime * 1.8);
              float wave2 = sin((p.x * -53.0 + p.y * 31.0) + uTime * 1.35);
              float wave3 = sin((p.x * 18.0 - p.y * 61.0) - uTime * 0.9);
              float ripple = (wave1 * 0.5 + wave2 * 0.32 + wave3 * 0.18) * 0.5 + 0.5;

              vec3 col = mix(uShallow, uDeep, depthMix);

              float skyReflection = smoothstep(-0.1, 0.45, p.y) * 0.22;
              col = mix(col, uHorizonTint, skyReflection);

              // Bright path of sun glints, concentrated toward one side (like the reference).
              float glintLane = exp(-pow((p.x - 0.23) * 4.8, 2.0));
              float glintNoise = sin((p.y * 120.0 + p.x * 16.0) + uTime * 3.4) * 0.5 + 0.5;
              glintNoise += sin((p.y * 176.0 - p.x * 22.0) - uTime * 4.1) * 0.5 + 0.5;
              glintNoise *= 0.5;
              float sparkle = pow(clamp(glintNoise * ripple, 0.0, 1.0), 7.0) * glintLane;
              sparkle += pow(clamp(ripple, 0.0, 1.0), 12.0) * 0.12 * shoreGlow;

              // Slight canopy shadow tint toward upper area for a shaded-bank feeling.
              float canopyShade = smoothstep(-0.02, 0.42, p.y) * 0.12;
              col *= (1.0 - canopyShade);

              col += uSparkle * sparkle * edge * 0.95;
              col = mix(col, uHorizonTint, shoreGlow * 0.08);

              float alpha = 0.9 * edge;
              gl_FragColor = vec4(col, alpha);
            }
          `}
        />
      </mesh>

      <group position={[0, ringY + 0.06, 0]}>
        <mesh
          position={[radiusX * 0.45, 0, radiusZ * 0.35]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[0.35, 0]} />
          <meshStandardMaterial color="#766451" roughness={0.95} />
        </mesh>
        <mesh
          position={[-radiusX * 0.55, 0.02, -radiusZ * 0.22]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[0.28, 0]} />
          <meshStandardMaterial color="#85715a" roughness={0.95} />
        </mesh>
      </group>
    </group>
  );
}
