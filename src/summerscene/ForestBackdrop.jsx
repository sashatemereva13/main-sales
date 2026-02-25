import { useMemo } from "react";
import * as THREE from "three";

function makeRidgeGeometry() {
  const geo = new THREE.PlaneGeometry(520, 260, 120, 80);
  geo.rotateX(-Math.PI / 2);

  const pos = geo.attributes.position;
  const colors = [];
  const c = new THREE.Color();

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);

    const backBand = Math.exp(-Math.pow((z + 92) / 58, 2));
    const ridge =
      backBand * (9.5 + Math.sin(x * 0.03) * 2.8 + Math.cos(x * 0.017) * 2.2);
    const shoulder =
      Math.exp(-Math.pow((z + 132) / 48, 2)) *
      (6.2 + Math.sin(x * 0.02 + 1.4) * 1.8);
    const taper = Math.exp(-Math.pow((z + 28) / 110, 2)) * 1.15;
    const y = ridge + shoulder - taper;

    pos.setY(i, y);

    const shade = THREE.MathUtils.clamp(
      0.25 + backBand * 0.55 + shoulder * 0.03,
      0,
      1,
    );
    c.setRGB(
      THREE.MathUtils.lerp(0.07, 0.14, shade),
      THREE.MathUtils.lerp(0.18, 0.34, shade),
      THREE.MathUtils.lerp(0.07, 0.13, shade),
    );
    colors.push(c.r, c.g, c.b);
  }

  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

function ShadowPatch({
  position,
  scale = [1, 1, 1],
  rotation = [0, 0, 0],
  opacity = 0.14,
}) {
  return (
    <mesh position={position} rotation={rotation} scale={scale} renderOrder={1}>
      <circleGeometry args={[1, 64]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={{
          uColor: { value: new THREE.Color("#214524") },
          uOpacity: { value: opacity },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform vec3 uColor;
          uniform float uOpacity;
          void main() {
            vec2 p = vUv - 0.5;
            float r = length(p) * 2.0;
            if (r > 1.0) discard;
            float alpha = smoothstep(1.0, 0.35, r);
            alpha *= alpha;
            gl_FragColor = vec4(uColor, alpha * uOpacity);
          }
        `}
      />
    </mesh>
  );
}

export default function ForestBackdrop() {
  const ridgeGeometry = useMemo(() => makeRidgeGeometry(), []);

  return (
    <group>
      <mesh
        geometry={ridgeGeometry}
        position={[0, -1.95, -46]}
        receiveShadow
        frustumCulled={false}
      >
        <meshStandardMaterial
          vertexColors
          roughness={0.99}
          metalness={0}
          color="#4d8e40"
          emissive="#193F0C"
          emissiveIntensity={0.045}
        />
      </mesh>

      {/* Soft canopy shadow bands near meadow perimeter (kept subtle over grass). */}
      <ShadowPatch
        position={[-64, -0.62, -6]}
        scale={[52, 1, 40]}
        rotation={[-Math.PI / 2, 0.18, 0]}
        opacity={0.12}
      />
      <ShadowPatch
        position={[72, -0.58, -18]}
        scale={[46, 1, 34]}
        rotation={[-Math.PI / 2, -0.22, 0]}
        opacity={0.1}
      />
      <ShadowPatch
        position={[0, -0.66, -78]}
        scale={[132, 1, 40]}
        rotation={[-Math.PI / 2, 0.05, 0]}
        opacity={0.15}
      />
    </group>
  );
}
