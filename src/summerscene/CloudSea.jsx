import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  MEADOW_ISLAND_CENTER,
  MEADOW_ISLAND_RADIUS,
} from "./meadowIslandConfig";

function createCloudTexture({
  size = 320,
  edgeAlpha = 0,
  coreAlpha = 1,
  warmTint = "255,248,241",
  shadowTint = "212,224,246",
} = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  ctx.clearRect(0, 0, size, size);

  for (let i = 0; i < 34; i += 1) {
    const x = size * (0.22 + Math.random() * 0.56);
    const y = size * (0.2 + Math.random() * 0.56);
    const r = size * (0.08 + Math.random() * 0.15);
    const gradient = ctx.createRadialGradient(x, y, r * 0.08, x, y, r);
    gradient.addColorStop(0, `rgba(${warmTint},${0.28 * coreAlpha})`);
    gradient.addColorStop(0.45, `rgba(255,255,255,${0.16 * coreAlpha})`);
    gradient.addColorStop(1, `rgba(255,255,255,0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Toon-like directional shade: cooler lower lobe, warmer upper lobe.
  const shade = ctx.createLinearGradient(0, size * 0.24, 0, size * 0.95);
  shade.addColorStop(0, "rgba(255,255,255,0)");
  shade.addColorStop(0.42, "rgba(255,255,255,0)");
  shade.addColorStop(1, `rgba(${shadowTint},${0.32 * coreAlpha})`);
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, size, size);

  const main = ctx.createRadialGradient(
    size * 0.44,
    size * 0.42,
    size * 0.1,
    size * 0.5,
    size * 0.52,
    size * 0.5,
  );
  main.addColorStop(0, `rgba(255,255,255,${coreAlpha})`);
  main.addColorStop(0.2, `rgba(${warmTint},${0.97 * coreAlpha})`);
  main.addColorStop(0.44, `rgba(248,245,242,${0.78 * coreAlpha})`);
  main.addColorStop(0.63, `rgba(${shadowTint},${0.42 * coreAlpha})`);
  main.addColorStop(1, `rgba(220,230,245,${edgeAlpha})`);
  ctx.fillStyle = main;
  ctx.fillRect(0, 0, size, size);

  const highlight = ctx.createRadialGradient(
    size * 0.38,
    size * 0.33,
    size * 0.02,
    size * 0.38,
    size * 0.33,
    size * 0.32,
  );
  highlight.addColorStop(0, `rgba(255,255,255,${0.26 * coreAlpha})`);
  highlight.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = highlight;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function buildCloudPuffs() {
  const puffs = [];
  let index = 0;

  const addPuff = ({
    x,
    y,
    z,
    scale,
    scaleY = 0.72,
    opacity,
    speed,
    drift,
    tower = 0,
    tint = "#ffffff",
    textureIndex = 0,
  }) => {
    puffs.push({
      key: `cloud-${index}`,
      basePosition: [x, y, z],
      scale,
      scaleY,
      opacity,
      speed,
      drift,
      tower,
      tint,
      textureIndex,
    });
    index += 1;
  };

  const ringCount = 38;
  for (let i = 0; i < ringCount; i += 1) {
    const t = i / ringCount;
    const angle = t * Math.PI * 2;
    const radius = MEADOW_ISLAND_RADIUS + 34 + Math.sin(angle * 4.5) * 16;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const towerHeight = 2 + Math.round((Math.sin(angle * 3.2) * 0.5 + 0.5) * 5);

    for (let level = 0; level < towerHeight; level += 1) {
      addPuff({
        x: x + Math.sin(level + angle) * 8,
        y: -15 + level * 10.5 + Math.cos(angle * 2 + level) * 1.8,
        z: z + Math.cos(level * 1.4 + angle) * 7,
        scale: 46 - level * 2 + (i % 3) * 8,
        scaleY: 0.8 - level * 0.03,
        opacity: 0.22 + level * 0.045,
        speed: 0.08 + level * 0.014 + (i % 5) * 0.004,
        drift: 1.4 + level * 0.6,
        tower: level,
        tint: level > 1 ? "#ffffff" : "#f2f6ff",
        textureIndex: level > 1 ? 1 : 0,
      });
    }
  }

  const seaCount = 72;
  for (let i = 0; i < seaCount; i += 1) {
    const angle = (i / seaCount) * Math.PI * 2 + 0.09;
    const radius = MEADOW_ISLAND_RADIUS + 12 + Math.sin(angle * 2.4) * 24;
    addPuff({
      x: Math.cos(angle) * radius,
      y: -26 + Math.sin(angle * 3.1) * 2.8,
      z: Math.sin(angle) * radius,
      scale: 58 + (i % 5) * 10,
      scaleY: 0.66,
      opacity: 0.2 + (i % 4) * 0.03,
      speed: 0.05 + (i % 6) * 0.006,
      drift: 0.9 + (i % 4) * 0.24,
      tint: "#ebf2fe",
      textureIndex: 0,
    });
  }

  const backdropCount = 24;
  for (let i = 0; i < backdropCount; i += 1) {
    const angle = Math.PI * 1.05 + (i / Math.max(backdropCount - 1, 1)) * Math.PI * 0.9;
    const radius = MEADOW_ISLAND_RADIUS + 108 + Math.sin(i * 0.7) * 30;
    const towerHeight = 4 + (i % 4);

    for (let level = 0; level < towerHeight; level += 1) {
      addPuff({
        x: Math.cos(angle) * radius + Math.sin(i + level) * 16,
        y: -10 + level * 12.4,
        z: Math.sin(angle) * radius - 56 + Math.cos(i * 0.7 + level) * 13,
        scale: 66 - level * 3 + (i % 2) * 10,
        scaleY: 0.82,
        opacity: 0.16 + level * 0.034,
        speed: 0.04 + level * 0.008,
        drift: 1.1 + level * 0.4,
        tower: level,
        tint: level > 1 ? "#ffffff" : "#eef4ff",
        textureIndex: level > 1 ? 1 : 0,
      });
    }
  }

  return puffs;
}

export default function CloudSea() {
  const outerGroupRef = useRef(null);
  const puffRefs = useRef([]);
  const textures = useMemo(
    () => [
      createCloudTexture({
        size: 320,
        edgeAlpha: 0,
        coreAlpha: 0.92,
        warmTint: "248,245,241",
        shadowTint: "212,224,246",
      }),
      createCloudTexture({
        size: 384,
        edgeAlpha: 0,
        coreAlpha: 1,
        warmTint: "255,252,246",
        shadowTint: "206,221,245",
      }),
    ],
    [],
  );
  const puffs = useMemo(() => buildCloudPuffs(), []);

  useEffect(() => {
    return () => {
      textures.forEach((texture) => texture.dispose());
    };
  }, [textures]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    if (outerGroupRef.current) {
      outerGroupRef.current.rotation.y = Math.sin(t * 0.018) * 0.03;
    }

    for (let i = 0; i < puffRefs.current.length; i += 1) {
      const sprite = puffRefs.current[i];
      const puff = puffs[i];
      if (!sprite || !puff) continue;

      sprite.position.y =
        puff.basePosition[1] +
        Math.sin(t * puff.speed + i * 0.43) * puff.drift;
      sprite.position.x =
        puff.basePosition[0] +
        Math.sin(t * (puff.speed * 0.32) + i * 0.27) * 0.9;
      sprite.position.z =
        puff.basePosition[2] +
        Math.cos(t * (puff.speed * 0.28) + i * 0.31) * 0.7;
      sprite.material.opacity =
        puff.opacity + Math.sin(t * (puff.speed * 0.8) + i * 0.2) * 0.02;
    }
  });

  return (
    <group
      ref={outerGroupRef}
      position={[MEADOW_ISLAND_CENTER[0], 0, MEADOW_ISLAND_CENTER[1]]}
    >
      {puffs.map((puff, index) => (
        <sprite
          key={puff.key}
          ref={(node) => {
            puffRefs.current[index] = node;
          }}
          position={puff.basePosition}
          scale={[puff.scale, puff.scale * puff.scaleY, 1]}
          renderOrder={-2}
        >
          <spriteMaterial
            map={textures[puff.textureIndex] ?? textures[0]}
            color={puff.tint}
            transparent
            opacity={puff.opacity}
            depthWrite={false}
            depthTest={true}
            fog={true}
          />
        </sprite>
      ))}
    </group>
  );
}
