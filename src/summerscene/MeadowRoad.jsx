import { useMemo } from "react";
import * as THREE from "three";
import { MEADOW_ROAD_PATH_XZ } from "./meadowRoadPath";
import { sampleVisibleTerrainHeight } from "./terrainSurface";

function buildRoadGeometry({
  width = 9.6,
  samples = 180,
  shoulderExpand = 1.42,
} = {}) {
  const curve = new THREE.CatmullRomCurve3(
    MEADOW_ROAD_PATH_XZ.map(([x, z]) => new THREE.Vector3(x, 0, z)),
    false,
    "catmullrom",
    0.22,
  );

  const centerPoints = curve.getSpacedPoints(samples - 1);
  const vertsPerRow = 4; // shoulderL, roadL, roadR, shoulderR
  const positions = new Float32Array(samples * vertsPerRow * 3);
  const uvs = new Float32Array(samples * vertsPerRow * 2);
  const indices = [];

  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const lateral = new THREE.Vector3();

  for (let i = 0; i < centerPoints.length; i++) {
    const p = centerPoints[i];
    a.copy(centerPoints[Math.max(0, i - 1)]);
    b.copy(centerPoints[Math.min(centerPoints.length - 1, i + 1)]);
    tangent.copy(b).sub(a).setY(0).normalize();
    lateral.set(-tangent.z, 0, tangent.x).normalize();

    const edgeOffsets = [
      -(width * shoulderExpand) * 0.5,
      -width * 0.5,
      width * 0.5,
      width * shoulderExpand * 0.5,
    ];

    for (let j = 0; j < edgeOffsets.length; j++) {
      const x = p.x + lateral.x * edgeOffsets[j];
      const z = p.z + lateral.z * edgeOffsets[j];

      // Slightly lift the road so it reads over grass/ground without z-fighting.
      const y = sampleVisibleTerrainHeight(x, z) + 0.03;

      const idx = i * vertsPerRow + j;
      positions[idx * 3 + 0] = x;
      positions[idx * 3 + 1] = y;
      positions[idx * 3 + 2] = z;

      const u = j / (vertsPerRow - 1);
      const v = i / (samples - 1);
      uvs[idx * 2 + 0] = u;
      uvs[idx * 2 + 1] = v;
    }
  }

  for (let row = 0; row < samples - 1; row++) {
    const start = row * vertsPerRow;
    const next = start + vertsPerRow;

    for (let col = 0; col < vertsPerRow - 1; col++) {
      const a0 = start + col;
      const a1 = start + col + 1;
      const b0 = next + col;
      const b1 = next + col + 1;

      indices.push(a0, b0, a1, a1, b0, b1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export default function MeadowRoad() {
  const geometry = useMemo(() => buildRoadGeometry(), []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: {
          uRoadColor: { value: new THREE.Color("#38566e") },
          uTrackColor: { value: new THREE.Color("#46a2c0") },
          uDustColor: { value: new THREE.Color("#62b7b7") },
          uShoulderColor: { value: new THREE.Color("#42496f") },
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vDepthMix;

          void main() {
            vUv = uv;
            vDepthMix = clamp((-position.z - 2.0) / 170.0, 0.0, 1.0);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uRoadColor;
          uniform vec3 uTrackColor;
          uniform vec3 uDustColor;
          uniform vec3 uShoulderColor;

          varying vec2 vUv;
          varying float vDepthMix;

          float hash(vec2 p) {
            p = fract(p * vec2(123.34, 456.21));
            p += dot(p, p + 34.45);
            return fract(p.x * p.y);
          }

          void main() {
            float x = (vUv.x - 0.5) * 2.0;

            // Road core in center, feathered grassy shoulders in the outer band.
            float roadMask = 1.0 - smoothstep(0.55, 0.84, abs(x));
            float shoulderMask = smoothstep(0.52, 0.98, abs(x)) * (1.0 - smoothstep(0.98, 1.0, abs(x)));
            float edgeFade = 1.0 - smoothstep(0.94, 1.0, abs(x));
            if (edgeFade <= 0.001) discard;

            float trackL = exp(-pow((x + 0.26) * 7.4, 2.0));
            float trackR = exp(-pow((x - 0.26) * 7.4, 2.0));
            float centerDust = exp(-pow(x * 3.25, 2.0));

            float grain =
              hash(vec2(vUv.y * 220.0, vUv.x * 31.0)) * 0.18 +
              hash(vec2(vUv.y * 84.0, vUv.x * 9.0)) * 0.12;

            vec3 road = uRoadColor;
            road = mix(road, uTrackColor, clamp(trackL + trackR, 0.0, 1.0) * 0.78);
            road = mix(road, uDustColor, centerDust * 0.32);
            road += grain * 0.08;

            vec3 shoulder = mix(uShoulderColor, uDustColor, 0.18 + grain * 0.35);

            vec3 color = mix(shoulder, road, roadMask);
            color *= mix(0.96, 1.07, vDepthMix);

            float alpha = max(roadMask * (0.82 + centerDust * 0.1), shoulderMask * 0.55);
            alpha *= edgeFade;

            gl_FragColor = vec4(color, alpha);
          }
        `,
      }),
    [],
  );

  return (
    <mesh
      position={[0, 0.5, 0]}
      geometry={geometry}
      material={material}
      renderOrder={1}
    />
  );
}
