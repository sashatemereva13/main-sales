import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  MEADOW_ISLAND_CENTER,
  MEADOW_ISLAND_RADIUS,
} from "./meadowIslandConfig";
import { sampleMeadowSurfaceHeight } from "./terrainSurface";

const GROUND_Y_OFFSET = -1.42;
const TEX_VARIANTS = 7;
const GRASS_COLOR_PRESETS = Object.freeze({
  skyMonochrome: Object.freeze({
    textureHueShift: -18,
    textureSaturationBoost: -10,
    textureLightnessBoost: 4,
    fieldTint: "#8c7a5f",
    fieldTintStrength: 0.38,
    flowerTintProtection: 0.82,
    hazeTint: "#efc7a6",
    hazeStrength: 0.22,
  }),
  skyComplementary: Object.freeze({
    textureHueShift: 6,
    textureSaturationBoost: -4,
    textureLightnessBoost: 2,
    fieldTint: "#5d7f49",
    fieldTintStrength: 0.4,
    flowerTintProtection: 0.78,
    hazeTint: "#d8c099",
    hazeStrength: 0.18,
  }),
});

const ACTIVE_GRASS_COLOR_PRESET = "skyComplementary";
const GRASS_COLOR_CONTROLS = GRASS_COLOR_PRESETS[ACTIVE_GRASS_COLOR_PRESET];
const GRASS_TEXTURE_VARIANT_CONFIGS = Object.freeze([
  Object.freeze({
    blades: 54,
    hueBase: 99,
    hueJitter: 9,
    petals: 76,
    densityAlpha: 0.18,
    leafWidth: 6.6,
    chunk: 30,
  }),
  Object.freeze({
    blades: 62,
    hueBase: 101,
    hueJitter: 8,
    petals: 64,
    densityAlpha: 0.14,
    leafWidth: 7.2,
    chunk: 27,
  }),
  Object.freeze({
    blades: 48,
    hueBase: 96,
    hueJitter: 10,
    petals: 92,
    densityAlpha: 0.2,
    leafWidth: 7.8,
    chunk: 35,
  }),
]);

function hexToShaderVec3(hex) {
  const color = new THREE.Color(hex);
  return `${color.r.toFixed(3)}, ${color.g.toFixed(3)}, ${color.b.toFixed(3)}`;
}

const FIELD_TINT_SHADER_VEC3 = hexToShaderVec3(GRASS_COLOR_CONTROLS.fieldTint);
const HAZE_TINT_SHADER_VEC3 = hexToShaderVec3(GRASS_COLOR_CONTROLS.hazeTint);
const GRASS_ISLAND_FIELDS = [
  {
    centerX: MEADOW_ISLAND_CENTER[0],
    centerZ: MEADOW_ISLAND_CENTER[1],
    radius: MEADOW_ISLAND_RADIUS,
  },
];
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
    float windA = sin(windPhase + uTime * 1.45);
    float windB = sin(windPhase * 1.9 + uTime * 1.02);
    float windC = sin(baseWorld.x * 0.11 - baseWorld.z * 0.06 + uTime * 0.62);
    float gust = smoothstep(0.15, 0.95, sin(uTime * 0.18 + baseWorld.x * 0.012));
    float wind =
      (windA * 0.52 + windB * 0.28 + windC * 0.2) *
      (0.09 + vPatchMix * 0.14 + gust * 0.08);

    vec2 hoverDelta = baseWorld.xz - uHover.xz;
    float hoverDist = length(hoverDelta);
    float hoverFalloff = 1.0 - smoothstep(0.0, uHoverRadius, hoverDist);
    vec2 hoverDir = hoverDist > 0.0001 ? hoverDelta / hoverDist : vec2(0.0);
    float hoverPush = hoverFalloff * 0.42;

    float tipMask = pow(clamp(uv.y, 0.0, 1.0), 1.35);
    pos.x += (wind + hoverDir.x * hoverPush) * tipMask;
    pos.z += (wind * 0.34 + hoverDir.y * hoverPush * 0.45) * tipMask;
    pos.y += abs(wind) * tipMask * 0.08;

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
    if (tex.a < 0.2) discard;

    vec3 color = tex.rgb;

    float patchSun = smoothstep(0.45, 1.0, vPatchMix);
    color = mix(color * 0.93, color * 1.01, patchSun);
    color *= mix(0.93, 1.01, vLightMix);

    // Keep the field meadow-green, but preserve more of the flower tint.
    float luma = dot(color, vec3(0.299, 0.587, 0.114));
    float flowerMask = smoothstep(0.64, 0.9, color.r + color.b - color.g * 0.6);
    color = mix(vec3(luma), color, 0.86);
    color = mix(
      color,
      vec3(${FIELD_TINT_SHADER_VEC3}),
      ${GRASS_COLOR_CONTROLS.fieldTintStrength.toFixed(2)} *
        (1.0 - flowerMask * ${GRASS_COLOR_CONTROLS.flowerTintProtection.toFixed(2)})
    );
    color = mix(color, color * vec3(1.12, 0.94, 1.02), flowerMask * 0.26);

    // Softer contrast with a cleaner sky-lit distance.
    float distant = smoothstep(0.52, 1.0, vDepthMix);
    vec3 hazeTint = vec3(${HAZE_TINT_SHADER_VEC3});
    color = mix(color, mix(vec3(dot(color, vec3(0.333))), color, 0.72), distant * 0.42);
    color = mix(color, hazeTint, distant * ${GRASS_COLOR_CONTROLS.hazeStrength.toFixed(2)});

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

function createGrassClusterTexture(variant = 0, anisotropy = 4) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    const fallbackTexture = new THREE.Texture(canvas);
    fallbackTexture.needsUpdate = true;
    return fallbackTexture;
  }
  ctx.clearRect(0, 0, 256, 256);

  const variantConfig =
    GRASS_TEXTURE_VARIANT_CONFIGS[
      ((variant % GRASS_TEXTURE_VARIANT_CONFIGS.length) +
        GRASS_TEXTURE_VARIANT_CONFIGS.length) %
        GRASS_TEXTURE_VARIANT_CONFIGS.length
    ];
  const hueShift = GRASS_COLOR_CONTROLS.textureHueShift;
  const satBoost = GRASS_COLOR_CONTROLS.textureSaturationBoost;
  const lightBoost = GRASS_COLOR_CONTROLS.textureLightnessBoost;

  for (let i = 0; i < 22 + variant * 4; i++) {
    const x = 12 + Math.random() * 232;
    const y = 154 + Math.random() * 88;
    const w = variantConfig.chunk * (0.7 + Math.random() * 0.9);
    const h = 18 + Math.random() * 34;
    const hue =
      variantConfig.hueBase +
      Math.random() * variantConfig.hueJitter +
      hueShift;
    const sat = 44 + Math.random() * 12 + satBoost;
    const light = 18 + Math.random() * 11 + lightBoost;
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

    const hue =
      variantConfig.hueBase +
      Math.random() * variantConfig.hueJitter +
      hueShift;
    const sat = 48 + Math.random() * 14 + satBoost;
    const light = 20 + Math.random() * 12 + lightBoost;
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

    ctx.strokeStyle = `hsla(${hue - 2}, ${Math.max(30, sat - 6)}%, ${Math.min(42, light + 6)}%, 0.52)`;
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
    const hue = 98 + Math.random() * 10 + hueShift;
    const sat = 40 + Math.random() * 10 + satBoost;
    const light = 17 + Math.random() * 8 + lightBoost;
    ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${variantConfig.densityAlpha})`;
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < variantConfig.petals; i++) {
    const x = 16 + Math.random() * 224;
    const y = 88 + Math.random() * 154;
    const petalW = 3.6 + Math.random() * 6.4;
    const petalH = 1.8 + Math.random() * 3.2;
    const rot = Math.random() * Math.PI;
    const tint = Math.random();

    if (tint < 0.2) ctx.fillStyle = "rgba(255,244,248,1)";
    else if (tint < 0.62) ctx.fillStyle = "rgba(255,193,220,1)";
    else if (tint < 0.9) ctx.fillStyle = "rgba(244,142,190,0.98)";
    else ctx.fillStyle = "rgba(255,185,103,0.98)";

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

function halton(index, base) {
  let result = 0;
  let fraction = 1 / base;
  let i = index;

  while (i > 0) {
    result += fraction * (i % base);
    i = Math.floor(i / base);
    fraction /= base;
  }

  return result;
}

function populateGrassLayer({
  meshA,
  meshB,
  count,
  zRange,
  xRange,
  fields,
  clearings,
  size,
  tempColor,
  dummyA,
  dummyB,
}) {
  if (!meshA || count <= 0) return;

  const [minZ, maxZ] = zRange;
  const [minX, maxX] = xRange;
  let placed = 0;
  const maxAttempts = count * 20;
  const spanX = maxX - minX;
  const spanZ = maxZ - minZ;
  const candidateArea = Math.max(spanX * spanZ, 1);
  const estimatedSpacing = Math.sqrt(candidateArea / Math.max(count, 1));
  const jitterX = Math.min(spanX * 0.035, estimatedSpacing * 0.55);
  const jitterZ = Math.min(spanZ * 0.035, estimatedSpacing * 0.55);

  for (let attempt = 0; attempt < maxAttempts && placed < count; attempt += 1) {
    // A low-discrepancy sequence fills the meadow more evenly than pure random sampling,
    // while a small offset keeps the result from looking like a grid.
    const sampleIndex = attempt + 1;
    const x = THREE.MathUtils.clamp(
      THREE.MathUtils.lerp(minX, maxX, halton(sampleIndex, 2)) +
        (halton(sampleIndex, 5) - 0.5) * jitterX,
      minX,
      maxX,
    );
    const z = THREE.MathUtils.clamp(
      THREE.MathUtils.lerp(minZ, maxZ, halton(sampleIndex, 3)) +
        (halton(sampleIndex, 7) - 0.5) * jitterZ,
      minZ,
      maxZ,
    );

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

    const terrainY = sampleMeadowSurfaceHeight(x, z) + GROUND_Y_OFFSET;

    const height =
      (size.hMin + Math.random() * size.hVar) * (0.95 + Math.random() * 0.1);
    const width = (size.wMin + Math.random() * size.wVar) * 2.05;

    const yaw = Math.random() * Math.PI;

    dummyA.position.set(x, terrainY, z);
    dummyA.rotation.set(0, yaw, 0);
    dummyA.scale.set(width, height, 1);
    dummyA.updateMatrix();
    meshA.setMatrixAt(placed, dummyA.matrix);

    if (meshB) {
      dummyB.position.set(x, terrainY, z);
      dummyB.rotation.set(0, yaw + Math.PI * 0.5, 0);
      dummyB.scale.set(width, height, 1);
      dummyB.updateMatrix();
      meshB.setMatrixAt(placed, dummyB.matrix);
    }

    tempColor.setRGB(1, 1, 1);
    meshA.setColorAt(placed, tempColor);
    if (meshB) meshB.setColorAt(placed, tempColor);

    placed++;
  }

  meshA.count = placed;
  if (meshB) meshB.count = placed;
  meshA.instanceMatrix.needsUpdate = true;
  if (meshB) meshB.instanceMatrix.needsUpdate = true;
  if (meshA.instanceColor) meshA.instanceColor.needsUpdate = true;
  if (meshB?.instanceColor) meshB.instanceColor.needsUpdate = true;
  meshA.computeBoundingSphere();
  if (meshB) meshB.computeBoundingSphere();
}

export default function GrassBlades({
  count = 9000,
  quality = "high",
  paused = false,
  hoverEnabled = true,
  crossLayers = true,
  conservative = false,
}) {
  const variantCount = quality === "low" ? 2 : TEX_VARIANTS;
  const textureAnisotropy = quality === "low" ? 1 : quality === "mid" ? 2 : 4;
  const baseSegments = quality === "low" ? 4 : quality === "mid" ? 5 : 7;
  const fgSegments = quality === "low" ? 5 : quality === "mid" ? 7 : 9;
  const hoverRadiusBase = quality === "low" ? 5.4 : 6.5;
  const hoverRadiusFg = quality === "low" ? 6.2 : 7.4;
  const frameDivider = quality === "low" ? 3 : quality === "mid" ? 2 : 2;

  const baseVariantCounts = useMemo(
    () =>
      allocateCounts(
        count,
        variantCount === 2 ? [0.58, 0.42] : [0.4, 0.34, 0.26],
      ),
    [count, variantCount],
  );
  const foregroundCount = Math.max(
    quality === "low" ? 9000 : 18000,
    Math.floor(count * (quality === "low" ? 0.34 : 0.48)),
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
    const g = new THREE.PlaneGeometry(1.72, 2.28, 1, baseSegments);
    g.translate(0, 1.075, 0);
    return g;
  }, [baseSegments]);

  const geometryForeground = useMemo(() => {
    const g = new THREE.PlaneGeometry(2.52, 3.18, 1, fgSegments);
    g.translate(0, 1.475, 0);
    return g;
  }, [fgSegments]);

  useEffect(() => {
    baseMeshARefs.current.forEach((meshA, i) => {
      populateGrassLayer({
        meshA,
        meshB: baseMeshBRefs.current[i],
        count: baseVariantCounts[i],
        zRange: [
          MEADOW_ISLAND_CENTER[1] - (MEADOW_ISLAND_RADIUS + 14),
          MEADOW_ISLAND_CENTER[1] + (MEADOW_ISLAND_RADIUS + 14),
        ],
        xRange: [
          MEADOW_ISLAND_CENTER[0] - (MEADOW_ISLAND_RADIUS + 14),
          MEADOW_ISLAND_CENTER[0] + (MEADOW_ISLAND_RADIUS + 14),
        ],
        fields: GRASS_ISLAND_FIELDS,
        size: {
          hMin: 1.08,
          hVar: 1.26,
          hDepth: 0.15,
          wMin: 0.92,
          wVar: 0.74,
          tilt: 0.14,
        },
        tempColor,
        dummyA,
        dummyB,
      });
    });

    populateGrassLayer({
      meshA: fgMeshARef.current,
      meshB: fgMeshBRef.current,
      count: foregroundCount,
      zRange: [
        MEADOW_ISLAND_CENTER[1] - (MEADOW_ISLAND_RADIUS + 4),
        MEADOW_ISLAND_CENTER[1] + (MEADOW_ISLAND_RADIUS + 4),
      ],
      xRange: [
        MEADOW_ISLAND_CENTER[0] - (MEADOW_ISLAND_RADIUS + 4),
        MEADOW_ISLAND_CENTER[0] + (MEADOW_ISLAND_RADIUS + 4),
      ],
      fields: GRASS_ISLAND_FIELDS,
      size: {
        hMin: 1.62,
        hVar: 1.58,
        hDepth: 0.15,
        wMin: 1.2,
        wVar: 0.92,
        tilt: 0.17,
      },
      tempColor,
      dummyA,
      dummyB,
    });
  }, [
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

  useEffect(() => {
    return () => {
      geometryBase.dispose();
      geometryForeground.dispose();
    };
  }, [geometryBase, geometryForeground]);

  useFrame((state) => {
    if (paused) return;

    frameCounterRef.current += 1;
    if (frameDivider > 1 && frameCounterRef.current % frameDivider !== 0)
      return;

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

  const materialProps = {
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: !conservative,
    alphaTest: 0.2,
    depthWrite: conservative,
    side: crossLayers ? THREE.FrontSide : THREE.DoubleSide,
  };

  return (
    <>
      {Array.from({ length: variantCount }).map((_, i) => (
        <group key={`grass-variant-${i}`}>
          <instancedMesh
            ref={(el) => {
              baseMeshARefs.current[i] = el;
            }}
            args={[geometryBase, null, baseVariantCounts[i]]}
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
              {...materialProps}
            />
          </instancedMesh>

          {crossLayers ? (
            <instancedMesh
              ref={(el) => {
                baseMeshBRefs.current[i] = el;
              }}
              args={[geometryBase, null, baseVariantCounts[i]]}
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
                {...materialProps}
              />
            </instancedMesh>
          ) : null}
        </group>
      ))}

      <instancedMesh
        ref={fgMeshARef}
        args={[geometryForeground, null, foregroundCount]}
      >
        <shaderMaterial
          ref={fgMatARef}
          uniforms={{
            uTime: { value: 0 },
            uHover: { value: new THREE.Vector3(9999, -1.4, 9999) },
            uHoverRadius: { value: hoverRadiusFg },
            uGrassTex: { value: textures[Math.min(textures.length - 1, 2)] },
          }}
          {...materialProps}
        />
      </instancedMesh>

      {crossLayers ? (
        <instancedMesh
          ref={fgMeshBRef}
          args={[geometryForeground, null, foregroundCount]}
        >
          <shaderMaterial
            ref={fgMatBRef}
            uniforms={{
              uTime: { value: 0 },
              uHover: { value: new THREE.Vector3(9999, -1.4, 9999) },
              uHoverRadius: { value: hoverRadiusFg },
              uGrassTex: { value: textures[Math.min(textures.length - 1, 2)] },
            }}
            {...materialProps}
          />
        </instancedMesh>
      ) : null}
    </>
  );
}
