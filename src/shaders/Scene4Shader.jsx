// BreathingAuraMaterial.jsx
import React from "react";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { extend } from "@react-three/fiber";

const AuraRawMaterial = shaderMaterial(
  {
    uTime: 0,
    uScroll: 0,
  },
  // Vertex Shader
  `
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uScroll;

  void main() {
float scale = 4.2;

vec2 uv = vec2(
  vUv.x - 0.5,
  vUv.y - 0.55   // ← THIS moves it up
) * scale;


    float dist = length(uv);

    // --- 1) Start with breathing expansion ---
// One-way pulse-growth combined into a single motion
float rawPulse = 0.4 + 0.5 * sin(uTime * 0.7 + uScroll * 8.0);
float linearGrow = 0.5 + uTime * 0.05; // slow, steady growth
float growth = max(rawPulse, linearGrow);
growth = min(growth, 1.0); // cap at max size

    // --- 2) Petal distortion that fades in over time ---
    float angle = atan(uv.y, uv.x);
    float petalShape = cos(angle * 6.0) * 0.3; // 6 petals
    float petalFade = smoothstep(0.6, 1.0, growth); // petals appear late
    dist += petalShape * petalFade;

    // --- 3) Aura & layers based on growth ---
    float aura = smoothstep(growth * 0.45, growth * 0.15, dist);
    float ring = smoothstep(growth * 0.6, growth * 0.2, dist);
    float innerGlow = smoothstep(0.2, 0.0, dist);
    float softFade = smoothstep(0.5, 0.25, dist);

    // --- 4) Color animation ---
    float wave = sin(dist * 20.0 - uTime * 3.0);
    float mixValue = 0.5 + 0.5 * wave;

    vec3 c1 = vec3(0.3, 0.7, 1.0);   // soft violet
    vec3 c2 = vec3(0.6, 1.0, 0.9);   // turquoise
    vec3 c3 = vec3(1.0, 0.9, 0.6);   // soft gold

    vec3 baseColor = mix(c1, c2, mixValue);
    baseColor = mix(baseColor, c3, uv.y + 0.5); // vertical gradient

    // --- Edge fade to avoid visible borders ---
float edgeFade = smoothstep(0.48, 0.38, dist);


float finalAlpha =
  max(aura, ring * 0.5 + innerGlow * 0.3)
  * softFade
  * edgeFade;

vec3 finalColor =
  baseColor * aura +
  baseColor * ring * 0.8 +
  baseColor * innerGlow * 0.6;

finalColor *= edgeFade; // optional but looks better

gl_FragColor = vec4(finalColor, finalAlpha);

  }
`,
);

extend({ AuraRawMaterial });

const BreathingAuraMaterial = React.forwardRef((props, ref) => {
  return <auraRawMaterial ref={ref} attach="material" {...props} />;
});

export default BreathingAuraMaterial;
