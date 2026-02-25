import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MEADOW_ROAD_PATH_XZ } from "./meadowRoadPath";

const GROUND_Y_OFFSET = -0.42;
const TEX_VARIANTS = 3;
const VERTEX_SHADER = `
  uniform float uTime;
  uniform vec3 uHover;
  uniform float uHoverRadius;

  varying vec2 vUv;
  varying float vDepthMix;
  varying float vPatchMix;
  varying float vLightMix;



  void main() {
    vUv = uv;


    vec3 pos = position;
    vec3 baseWorld = (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;

    vDepthMix = clamp((baseWorld.z + 115.0) / 210.0, 0.0, 1.0);

    float patchNoise =
      sin(baseWorld.x * 0.055 + baseWorld.z * 0.022) *
      cos(baseWorld.z * 0.037 - baseWorld.x * 0.015);
    vPatchMix = patchNoise * 0.5 + 0.5;

    vLightMix = clamp(
      sin(baseWorld.x * 0.014 - baseWorld.z * 0.008) * 0.5 + 0.5,
      0.0,
      1.0
    );

    float windPhase = baseWorld.x * 0.35 + baseWorld.z * 0.29;
    float windA = sin(windPhase + uTime * 1.25);
    float windB = sin(windPhase * 1.9 + uTime * 0.9);
    float wind = (windA * 0.65 + windB * 0.35) * (0.05 + vPatchMix * 0.08);

    vec2 hoverDelta = baseWorld.xz - uHover.xz;
    float hoverDist = length(hoverDelta);
    float hoverFalloff = 1.0 - smoothstep(0.0, uHoverRadius, hoverDist);
    vec2 hoverDir = hoverDist > 0.0001 ? hoverDelta / hoverDist : vec2(0.0);
    float hoverPush = hoverFalloff * 0.42;

    float tipMask = pow(clamp(uv.y, 0.0, 1.0), 1.35);
    pos.x += (wind + hoverDir.x * hoverPush) * tipMask;
    pos.z += (wind * 0.18 + hoverDir.y * hoverPush * 0.45) * tipMask;

    gl_Position =
      projectionMatrix *
      modelViewMatrix *
      instanceMatrix *
      vec4(pos, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform sampler2D uGrassTex;

  varying vec2 vUv;
  varying float vDepthMix;
  varying float vPatchMix;
  varying float vLightMix;

  void main() {
    vec4 tex = texture2D(uGrassTex, vUv);
    if (tex.a < 0.38) discard;

    vec3 color = tex.rgb;

    float patchSun = smoothstep(0.45, 1.0, vPatchMix);
    color = mix(color * 0.93, color * 1.01, patchSun);
    color *= mix(0.93, 1.01, vLightMix);

    // Slightly desaturate greens and add a warm global tint.
    float luma = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(luma), color, 0.82);
    color *= vec3(1.045, 0.995, 0.9);

    // Softer contrast and warmer haze in the distance.
    float distant = smoothstep(0.52, 1.0, vDepthMix);
    vec3 hazeTint = vec3(0.93, 0.86, 0.73);
    color = mix(color, mix(vec3(dot(color, vec3(0.333))), color, 0.62), distant * 0.5);
    color = mix(color, hazeTint, distant * 0.2);

    color *= (0.78 + vUv.y * 0.28);

    // Depth fog / atmospheric falloff.
    float depthFade = 1.0 - distant * 0.14;

    // Very subtle "DOF-like" softening on extreme foreground cards.
    float foreground = 1.0 - smoothstep(0.08, 0.2, vDepthMix);
    color = mix(color, vec3(dot(color, vec3(0.333))), foreground * 0.1);
    color = mix(color, color * vec3(1.02, 1.0, 0.96), foreground * 0.06);
    float foregroundAlphaSoft = 1.0 - foreground * 0.08;

    gl_FragColor = vec4(color, tex.a * depthFade * foregroundAlphaSoft);
  }
`;

function sampleGroundHeight(x, z) {
  const swellA = Math.sin(x * 0.016) * Math.cos(z * 0.014) * 0.78;
  const swellB = Math.sin((x + z) * 0.009) * 0.56;
  const swellC = Math.cos((x - z) * 0.007) * 0.42;
  const micro = Math.sin(x * 0.07 + z * 0.045) * 0.07;
  return swellA + swellB + swellC + micro - 0.22;
}

function distToSegmentSqXZ(px, pz, ax, az, bx, bz) {
  const abx = bx - ax;
  const abz = bz - az;
  const apx = px - ax;
  const apz = pz - az;
  const denom = abx * abx + abz * abz || 1;
  const t = THREE.MathUtils.clamp((apx * abx + apz * abz) / denom, 0, 1);
  const cx = ax + abx * t;
  const cz = az + abz * t;
  const dx = px - cx;
  const dz = pz - cz;
  return dx * dx + dz * dz;
}

function inRoadClearing(x, z) {
  // Keep the path readable, but hug the road tighter so the meadow doesn't look over-cleared.
  const roadHalfWidth = z > -12 ? 1.0 : z > -45 ? 0.5 : z > -90 ? 2.35 : 1.95;
  const shoulderPadding = z > -45 ? 0.8 : 0.6;
  const clearanceRadius = roadHalfWidth + shoulderPadding;
  const clearanceSq = clearanceRadius * clearanceRadius;

  for (let i = 0; i < MEADOW_ROAD_PATH_XZ.length - 1; i++) {
    const [ax, az] = MEADOW_ROAD_PATH_XZ[i];
    const [bx, bz] = MEADOW_ROAD_PATH_XZ[i + 1];
    if (distToSegmentSqXZ(x, z, ax, az, bx, bz) <= clearanceSq) return true;
  }

  return false;
}

function createGrassClusterTexture(variant = 0, anisotropy = 4) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 256, 256);

  const variantConfig = [
    {
      blades: 54,
      hueBase: 98,
      hueJitter: 14,
      petals: 16,
      densityAlpha: 0.24,
      leafWidth: 4.8,
      chunk: 26,
    },
    {
      blades: 62,
      hueBase: 106,
      hueJitter: 10,
      petals: 10,
      densityAlpha: 0.18,
      leafWidth: 5.4,
      chunk: 22,
    },
    {
      blades: 48,
      hueBase: 92,
      hueJitter: 18,
      petals: 24,
      densityAlpha: 0.28,
      leafWidth: 5.8,
      chunk: 30,
    },
  ][variant % TEX_VARIANTS];

  for (let i = 0; i < 22 + variant * 4; i++) {
    const x = 12 + Math.random() * 232;
    const y = 154 + Math.random() * 88;
    const w = variantConfig.chunk * (0.7 + Math.random() * 0.9);
    const h = 18 + Math.random() * 34;
    const hue = variantConfig.hueBase + Math.random() * variantConfig.hueJitter;
    const sat = 44 + Math.random() * 12;
    const light = 28 + Math.random() * 20;
    ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${0.24 + Math.random() * 0.16})`;
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < variantConfig.blades; i++) {
    const x = 18 + Math.random() * 220;
    const baseY = 236 + Math.random() * 16;
    const h = 52 + Math.random() * 132;
    const bend = (Math.random() - 0.5) * (22 + variant * 7);
    const width = 1.8 + Math.random() * variantConfig.leafWidth;

    const hue = variantConfig.hueBase + Math.random() * variantConfig.hueJitter;
    const sat = 46 + Math.random() * 13;
    const light = 30 + Math.random() * 24;
    ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${light}%, 0.94)`;
    ctx.lineWidth = width;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.quadraticCurveTo(
      x + bend * 0.22,
      baseY - h * 0.45,
      x + bend,
      baseY - h,
    );
    ctx.stroke();

    ctx.strokeStyle = `hsla(${hue - 4}, ${Math.max(45, sat - 12)}%, ${Math.min(70, light + 12)}%, 0.5)`;
    ctx.lineWidth = width * 0.42;
    ctx.beginPath();
    ctx.moveTo(x - width * 0.15, baseY - h * 0.08);
    ctx.quadraticCurveTo(
      x + bend * 0.12,
      baseY - h * 0.48,
      x + bend * 0.7,
      baseY - h * 0.82,
    );
    ctx.stroke();
  }

  for (let i = 0; i < 12 + variant * 3; i++) {
    const x = 10 + Math.random() * 236;
    const y = 182 + Math.random() * 62;
    const w = 18 + Math.random() * 42;
    const h = 14 + Math.random() * 30;
    const hue = 88 + Math.random() * 26;
    const sat = 40 + Math.random() * 12;
    const light = 32 + Math.random() * 14;
    ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${variantConfig.densityAlpha})`;
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < variantConfig.petals; i++) {
    const x = 16 + Math.random() * 224;
    const y = 88 + Math.random() * 154;
    const petalW = 2.4 + Math.random() * 4.2;
    const petalH = 1.2 + Math.random() * 2.4;
    const rot = Math.random() * Math.PI;
    const tint = Math.random();

    if (tint < 0.48) ctx.fillStyle = "rgba(255,249,239,0.98)";
    else if (tint < 0.84) ctx.fillStyle = "rgba(252,224,236,0.98)";
    else ctx.fillStyle = "rgba(244,201,226,0.96)";

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, petalW, petalH, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.minFilter = THREE.LinearMipMapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = anisotropy;
  tex.needsUpdate = true;
  return tex;
}

function allocateCounts(total, ratios) {
  let remaining = total;
  return ratios.map((ratio, idx) => {
    if (idx === ratios.length - 1) return remaining;
    const n = Math.floor(total * ratio);
    remaining -= n;
    return n;
  });
}

function populateGrassLayer({
  meshA,
  meshB,
  count,
  zRange,
  xSpreadRange,
  fields,
  clearings,
  size,
  tempColor,
  dummyA,
  dummyB,
  depthBias = 1,
}) {
  if (!meshA || !meshB || count <= 0) return;

  const [minZ, maxZ] = zRange;
  let placed = 0;
  const gridSize = 1.15; // tighter carpet for near-continuous coverage

  for (let gx = -xSpreadRange[1]; gx < xSpreadRange[1]; gx += gridSize) {
    for (let gz = zRange[0]; gz < zRange[1]; gz += gridSize) {
      if (placed >= count) break;

      const x = gx + (Math.random() - 0.5) * gridSize * 0.6;
      const z = gz + (Math.random() - 0.5) * gridSize * 0.6;

      if (fields?.length) {
        const insideAnyField = fields.some((field) => {
          const dx = x - field.centerX;
          const dz = z - field.centerZ;
          return dx * dx + dz * dz <= field.radius * field.radius;
        });
        if (!insideAnyField) continue;
      }

      if (clearings?.length) {
        const insideClearing = clearings.some((c) => {
          const nx = (x - c.centerX) / c.radiusX;
          const nz = (z - c.centerZ) / c.radiusZ;
          return nx * nx + nz * nz <= 1;
        });
        if (insideClearing) continue;
      }

      if (inRoadClearing(x, z)) continue;

      const terrainY = sampleGroundHeight(x, z) + GROUND_Y_OFFSET;

      const height =
        (size.hMin + Math.random() * size.hVar) * (0.95 + Math.random() * 0.1);
      const width = (size.wMin + Math.random() * size.wVar) * 1.28;

      const yaw = Math.random() * Math.PI;

      dummyA.position.set(x, terrainY, z);
      dummyA.rotation.set(0, yaw, 0);
      dummyA.scale.set(width, height, 1);
      dummyA.updateMatrix();
      meshA.setMatrixAt(placed, dummyA.matrix);

      dummyB.position.set(x, terrainY, z);
      dummyB.rotation.set(0, yaw + Math.PI * 0.5, 0);
      dummyB.scale.set(width, height, 1);
      dummyB.updateMatrix();
      meshB.setMatrixAt(placed, dummyB.matrix);

      tempColor.setRGB(1, 1, 1);
      meshA.setColorAt(placed, tempColor);
      meshB.setColorAt(placed, tempColor);

      placed++;
    }
  }

  meshA.count = placed;
  meshB.count = placed;
  meshA.instanceMatrix.needsUpdate = true;
  meshB.instanceMatrix.needsUpdate = true;
  if (meshA.instanceColor) meshA.instanceColor.needsUpdate = true;
  if (meshB.instanceColor) meshB.instanceColor.needsUpdate = true;
}

export default function GrassBlades({
  count = 72000,
  quality = "high",
  paused = false,
  hoverEnabled = true,
}) {
  const variantCount = quality === "low" ? 2 : TEX_VARIANTS;
  const textureAnisotropy = quality === "low" ? 1 : quality === "mid" ? 2 : 4;
  const baseSegments = quality === "low" ? 4 : quality === "mid" ? 5 : 7;
  const fgSegments = quality === "low" ? 5 : quality === "mid" ? 7 : 9;
  const hoverRadiusBase = quality === "low" ? 5.4 : 6.5;
  const hoverRadiusFg = quality === "low" ? 6.2 : 7.4;
  const frameDivider = quality === "low" ? 2 : 1;
  const FIELDS = [
    { centerX: 0, centerZ: 0, radius: 90 }, // main meadow
    { centerX: 0, centerZ: -40, radius: 35 }, // foreground patch
  ];
  const POND_CLEARINGS = [
    { centerX: 18, centerZ: -18, radiusX: 13.5, radiusZ: 9.5 },
  ];

  const baseVariantCounts = useMemo(
    () =>
      allocateCounts(
        count,
        variantCount === 2 ? [0.58, 0.42] : [0.4, 0.34, 0.26],
      ),
    [count, variantCount],
  );
  const foregroundCount = Math.max(
    quality === "low" ? 4500 : 10000,
    Math.floor(count * (quality === "low" ? 0.18 : 0.26)),
  );

  const baseMeshARefs = useRef([]);
  const baseMeshBRefs = useRef([]);
  const baseMatARefs = useRef([]);
  const baseMatBRefs = useRef([]);
  const fgMeshARef = useRef();
  const fgMeshBRef = useRef();
  const fgMatARef = useRef();
  const fgMatBRef = useRef();

  const dummyA = useMemo(() => new THREE.Object3D(), []);
  const dummyB = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);
  const hoverVec = useMemo(() => new THREE.Vector3(9999, -1.4, 9999), []);
  const hitPoint = useMemo(() => new THREE.Vector3(), []);
  const farHover = useMemo(() => new THREE.Vector3(9999, -1.4, 9999), []);
  const groundPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), 1.4),
    [],
  );
  const frameCounterRef = useRef(0);

  const textures = useMemo(
    () =>
      Array.from({ length: variantCount }, (_, i) =>
        createGrassClusterTexture(i, textureAnisotropy),
      ),
    [variantCount, textureAnisotropy],
  );

  const geometryBase = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.9, 1.75, 1, baseSegments);
    g.translate(0, 0.875, 0);
    return g;
  }, [baseSegments]);

  const geometryForeground = useMemo(() => {
    const g = new THREE.PlaneGeometry(1.15, 2.25, 1, fgSegments);
    g.translate(0, 1.125, 0);
    return g;
  }, [fgSegments]);

  useEffect(() => {
    for (let i = 0; i < variantCount; i++) {
      populateGrassLayer({
        meshA: baseMeshARefs.current[i],
        meshB: baseMeshBRefs.current[i],
        count: baseVariantCounts[i],
        zRange: [-205, 185],
        xSpreadRange: [52, 108],
        fields: FIELDS,
        clearings: POND_CLEARINGS,
        size: {
          hMin: 0.72,
          hVar: 0.9,
          hDepth: 0.22,
          wMin: 0.62,
          wVar: 0.52,
          tilt: 0.13,
        },
        tempColor,
        dummyA,
        dummyB,
        depthBias: 0.62,
      });
    }

    populateGrassLayer({
      meshA: fgMeshARef.current,
      meshB: fgMeshBRef.current,
      count: foregroundCount,
      zRange: [-100, 40],
      xSpreadRange: [-100, 100],
      fields: FIELDS,
      clearings: POND_CLEARINGS,
      size: {
        hMin: 1.1,
        hVar: 1.15,
        hDepth: 0.15,
        wMin: 0.9,
        wVar: 0.62,
        tilt: 0.17,
      },
      tempColor,
      dummyA,
      dummyB,
      depthBias: 0.85,
    });
  }, [
    FIELDS,
    POND_CLEARINGS,
    baseVariantCounts,
    foregroundCount,
    variantCount,
    tempColor,
    dummyA,
    dummyB,
  ]);

  useEffect(() => {
    return () => {
      textures.forEach((t) => t.dispose());
    };
  }, [textures]);

  useFrame((state) => {
    if (paused) return;

    frameCounterRef.current += 1;
    if (frameDivider > 1 && frameCounterRef.current % frameDivider !== 0) return;

    if (hoverEnabled) {
      state.raycaster.setFromCamera(state.pointer, state.camera);
      const hasHit = state.raycaster.ray.intersectPlane(groundPlane, hitPoint);
      hoverVec.lerp(hasHit ? hitPoint : farHover, hasHit ? 0.22 : 0.08);
    } else {
      hoverVec.lerp(farHover, 0.25);
    }

    const allMaterials = [
      ...baseMatARefs.current,
      ...baseMatBRefs.current,
      fgMatARef.current,
      fgMatBRef.current,
    ];

    for (const mat of allMaterials) {
      if (!mat) continue;
      mat.uniforms.uTime.value = state.clock.elapsedTime;
      mat.uniforms.uHover.value.copy(hoverVec);
    }
  });

  return (
    <>
      {Array.from({ length: variantCount }).map((_, i) => (
        <group key={`grass-variant-${i}`}>
          <instancedMesh
            ref={(el) => {
              baseMeshARefs.current[i] = el;
            }}
            args={[geometryBase, null, baseVariantCounts[i]]}
            castShadow
            receiveShadow
            frustumCulled={false}
          >
            <shaderMaterial
              ref={(el) => {
                baseMatARefs.current[i] = el;
              }}
              uniforms={{
                uTime: { value: 0 },
                uHover: { value: new THREE.Vector3(9999, -1.4, 9999) },
                uHoverRadius: { value: hoverRadiusBase },
                uGrassTex: { value: textures[i] },
              }}
              vertexShader={VERTEX_SHADER}
              fragmentShader={FRAGMENT_SHADER}
              transparent
              alphaTest={0.38}
              side={THREE.DoubleSide}
            />
          </instancedMesh>

          <instancedMesh
            ref={(el) => {
              baseMeshBRefs.current[i] = el;
            }}
            args={[geometryBase, null, baseVariantCounts[i]]}
            castShadow
            receiveShadow
            frustumCulled={false}
          >
            <shaderMaterial
              ref={(el) => {
                baseMatBRefs.current[i] = el;
              }}
              uniforms={{
                uTime: { value: 0 },
                uHover: { value: new THREE.Vector3(9999, -1.4, 9999) },
                uHoverRadius: { value: hoverRadiusBase },
                uGrassTex: { value: textures[i] },
              }}
              vertexShader={VERTEX_SHADER}
              fragmentShader={FRAGMENT_SHADER}
              transparent
              alphaTest={0.38}
              side={THREE.DoubleSide}
            />
          </instancedMesh>
        </group>
      ))}

      <instancedMesh
        ref={fgMeshARef}
        args={[geometryForeground, null, foregroundCount]}
        castShadow
        receiveShadow
        frustumCulled={false}
      >
        <shaderMaterial
          ref={fgMatARef}
          uniforms={{
            uTime: { value: 0 },
            uHover: { value: new THREE.Vector3(9999, -1.4, 9999) },
            uHoverRadius: { value: hoverRadiusFg },
            uGrassTex: { value: textures[Math.min(textures.length - 1, 2)] },
          }}
          vertexShader={VERTEX_SHADER}
          fragmentShader={FRAGMENT_SHADER}
          transparent
          alphaTest={0.38}
          side={THREE.DoubleSide}
        />
      </instancedMesh>

      <instancedMesh
        ref={fgMeshBRef}
        args={[geometryForeground, null, foregroundCount]}
        castShadow
        receiveShadow
        frustumCulled={false}
      >
        <shaderMaterial
          ref={fgMatBRef}
          uniforms={{
            uTime: { value: 0 },
            uHover: { value: new THREE.Vector3(9999, -1.4, 9999) },
            uHoverRadius: { value: hoverRadiusFg },
            uGrassTex: { value: textures[Math.min(textures.length - 1, 2)] },
          }}
          vertexShader={VERTEX_SHADER}
          fragmentShader={FRAGMENT_SHADER}
          transparent
          alphaTest={0.38}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
    </>
  );
}
