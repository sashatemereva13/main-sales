// GoldenSky.jsx
import { useMemo } from "react";
import * as THREE from "three";

export default function GoldenSky() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        zenithColor: { value: new THREE.Color("#ed9f9e") },
        midColor: { value: new THREE.Color("#e4c495") },
        horizonColor: { value: new THREE.Color("#ffd8bd") },
        hazeColor: { value: new THREE.Color("#d8c3ad") },
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
        varying vec3 vWorldPosition;

        void main() {
          float h = normalize(vWorldPosition).y;
          float t = clamp(h * 0.5 + 0.5, 0.0, 1.0);

          vec3 grad = mix(horizonColor, midColor, smoothstep(0.03, 0.52, t));
          grad = mix(grad, zenithColor, smoothstep(0.48, 0.96, t));

          // Very light atmospheric haze near the horizon.
          float hazeBand = 1.0 - smoothstep(-0.08, 0.2, h);
          grad = mix(grad, hazeColor, hazeBand * 0.4);

          // Soft bloom around the horizon line.
          float horizonGlow = exp(-pow((h - 0.015) * 7.4, 2.0));
          grad += hazeColor * (horizonGlow * 0.14);

          gl_FragColor = vec4(grad, 1.0);
        }
      `,
    });
  }, []);

  return (
    <mesh>
      <sphereGeometry args={[500, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
