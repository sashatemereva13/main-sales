// GoldenSky.jsx
import { useEffect, useMemo } from "react";
import * as THREE from "three";

export default function GoldenSky() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        zenithColor: { value: new THREE.Color("#7f5431") },
        midColor: { value: new THREE.Color("#bf7a45") },
        horizonColor: { value: new THREE.Color("#ffd0a0") },
        hazeColor: { value: new THREE.Color("#ffe4c1") },
        cloudBounceColor: { value: new THREE.Color("#ffd7af") },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 zenithColor;
        uniform vec3 midColor;
        uniform vec3 horizonColor;
        uniform vec3 hazeColor;
        uniform vec3 cloudBounceColor;
        varying vec3 vWorldPosition;

        void main() {
          vec3 dir = normalize(vWorldPosition);
          float h = dir.y;
          float t = clamp(h * 0.5 + 0.5, 0.0, 1.0);

          vec3 grad = mix(horizonColor, midColor, smoothstep(0.03, 0.52, t));
          grad = mix(grad, zenithColor, smoothstep(0.48, 0.96, t));

          // Slightly stylized sky banding for an illustration-like feel.
          float band = floor(t * 6.0) / 6.0;
          grad = mix(grad, grad * 1.03, band * 0.2);

          // Light atmospheric haze near the horizon.
          float hazeBand = 1.0 - smoothstep(-0.08, 0.2, h);
          grad = mix(grad, hazeColor, hazeBand * 0.52);

          // Soft bloom around the horizon line.
          float horizonGlow = exp(-pow((h - 0.015) * 7.4, 2.0));
          grad += hazeColor * (horizonGlow * 0.22);

          // Subtle top-down bounce to connect clouds and sky tones.
          float cloudBounce = smoothstep(0.12, 0.7, h) * 0.16;
          grad = mix(grad, cloudBounceColor, cloudBounce);

          // Gentle sun-side lift to mimic hand-painted anime skies.
          float sunSweep = exp(-pow((dir.x - 0.28) * 2.8, 2.0)) * smoothstep(0.05, 0.65, h);
          grad += vec3(0.12, 0.075, 0.03) * sunSweep;

          gl_FragColor = vec4(grad, 1.0);
        }
      `,
    });
  }, []);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  return (
    <group position={[0, 0, 0]}>
      <mesh>
        <sphereGeometry args={[500, 64, 64]} />
        <primitive object={material} attach="material" />
      </mesh>

      {/* <sprite position={[145, 54, -250]} scale={[58, 58, 1]}>
        <spriteMaterial
          map={sunGlowTexture}
          color="#ffb36e"
          transparent
          opacity={0.55}
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite> */}
      {/* 
      <sprite position={[145, 54, -248]} scale={[26, 26, 1]}>
        <spriteMaterial
          map={sunCoreTexture}
          color="#fff3cf"
          transparent
          opacity={0.98}
          depthWrite={false}
          depthTest={false}
        />
      </sprite> */}
    </group>
  );
}
