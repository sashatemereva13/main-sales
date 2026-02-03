// IridescentMaterial.jsx
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { extend } from "@react-three/fiber";
import React from "react";

const IridescentRawMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uMouseTime: 0,
  },
  // Vertex Shader
  `
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 pos = position;

      // Wavy surface
      pos.z += sin(pos.x * 5.0 + uTime * 2.0) * 0.4;
      pos.z += cos(pos.y * 4.0 + uTime * 1.5) * 0.3;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `varying vec2 vUv;
uniform float uTime;
uniform vec2 uMouse;

// Color palette
vec3 getWaveColor(float t) {
  vec3 c1 = vec3(0.8, 0.3, 1.0); // violet
  vec3 c2 = vec3(0.2, 0.9, 1.0); // turquoise
  vec3 c3 = vec3(1.0, 0.5, 0.6); // pink
  vec3 c4 = vec3(1.0, 0.8, 0.2); // orange
  float band = mod(t, 4.0);
  if (band < 1.0) return mix(c1, c2, band);
  else if (band < 2.0) return mix(c2, c3, band - 1.0);
  else if (band < 3.0) return mix(c3, c4, band - 2.0);
  else return mix(c4, c1, band - 3.0);
}

void main() {
  vec2 mouseUV = uMouse;
  float dist = distance(vUv, mouseUV);

  // Heat distortion effect
  float heat = exp(-dist * 30.0); // Closer = stronger
  vec2 distortion = normalize(vUv - mouseUV) * 0.01 * heat;

  // Fake wave motion
  float wave = sin((vUv.x + uTime * 0.2) * 10.0) +
               sin((vUv.x + uTime * 0.4) * 6.0) * 0.5;

  // Color sampling with distortion
  vec3 baseColor = getWaveColor(wave + uTime * 0.5);
  vec3 warmShift = vec3(1.4, 0.9, 0.7); // shift to warmer tones
  vec3 color = mix(baseColor, baseColor * warmShift, heat);

  gl_FragColor = vec4(color, 0.9);
}
`
);

extend({ IridescentRawMaterial });

const IridescentMaterial = React.forwardRef((props, ref) => {
  return <iridescentRawMaterial ref={ref} attach="material" {...props} />;
});

export default IridescentMaterial;
