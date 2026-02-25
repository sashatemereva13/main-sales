import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Clone, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const GROUND_MESH_Y = 0.52;
const FOREST_MESH_Y = 5.95;
const FOREST_MESH_Z = -46;
const TREE_SURFACE_LIFT = 4.04;
const TREE_ROOT_SINK = 0.1;
const TREE_POSITIONS = [
  // Edit these 5 entries to move trees: x (left/right), z (depth), y (height offset), yaw (rotation), height (visual size).
  { x: 4, y: -4, z: -25, yaw: 0.95, height: 25.5, tiltX: -0.01, tiltZ: 0.012 },
  {
    x: 40,
    y: 2,
    z: -104,
    yaw: 4.15,
    height: 37.5,
    tiltX: 0.012,
    tiltZ: -0.01,
  },
  {
    x: -58,
    y: -2,
    z: -74,
    yaw: 1.72,
    height: 31.5,
    tiltX: -0.008,
    tiltZ: 0.01,
  },
  { x: 54, y: -3, z: -68, yaw: 2.56, height: 33.0, tiltX: 0.01, tiltZ: -0.012 },
  {
    x: -60,
    y: -3,
    z: -114,
    yaw: 5.35,
    height: 37.5,
    tiltX: -0.006,
    tiltZ: 0.006,
  },
];

function sampleGroundHeight(x, z) {
  const swellA = Math.sin(x * 0.016) * Math.cos(z * 0.014) * 0.78;
  const swellB = Math.sin((x + z) * 0.009) * 0.56;
  const swellC = Math.cos((x - z) * 0.007) * 0.42;
  const micro = Math.sin(x * 0.07 + z * 0.045) * 0.07;
  return swellA + swellB + swellC + micro - 0.22;
}

function sampleMeadowSurfaceHeight(x, z) {
  return sampleGroundHeight(x, z) + GROUND_MESH_Y;
}

function sampleForestRidgeHeight(x, worldZ) {
  const z = worldZ - FOREST_MESH_Z;
  const backBand = Math.exp(-Math.pow((z + 92) / 58, 2));
  const ridge =
    backBand * (9.5 + Math.sin(x * 0.03) * 2.8 + Math.cos(x * 0.017) * 2.2);
  const shoulder =
    Math.exp(-Math.pow((z + 132) / 48, 2)) *
    (6.2 + Math.sin(x * 0.02 + 1.4) * 1.8);
  const taper = Math.exp(-Math.pow((z + 28) / 110, 2)) * 1.15;
  return ridge + shoulder - taper + FOREST_MESH_Y;
}

function sampleVisibleTerrainHeight(x, z) {
  const meadow = sampleMeadowSurfaceHeight(x, z);
  if (z > -55) return meadow;

  const ridge = sampleForestRidgeHeight(x, z);
  const blend = THREE.MathUtils.smoothstep(z, -55, -78);
  return THREE.MathUtils.lerp(meadow, ridge, blend);
}

function hash(i) {
  const x = Math.sin(i * 127.1) * 43758.5453123;
  return x - Math.floor(x);
}

function prepareTreeTemplate(scene) {
  const root = scene.clone(true);

  root.traverse((child) => {
    if (!child.isMesh) return;

    child.castShadow = true;
    child.receiveShadow = true;

    if (!child.material) return;

    const darkenMaterial = (mat) => {
      const m = mat.clone();

      // darker
      if (m.color) m.color.multiplyScalar(0.45);
      m.roughness =
        m.roughness !== undefined ? Math.min(1, m.roughness + 0.25) : 0.9;
      m.metalness = 0.0;

      m.alphaTest = m.alphaTest ?? 0.5;

      m.needsUpdate = true;
      return m;
    };

    if (Array.isArray(child.material)) {
      child.material = child.material.map(darkenMaterial);
    } else {
      child.material = darkenMaterial(child.material);
    }
  });
  return root;
}

export default function Trees({ count = 5 }) {
  const swayRefs = useRef([]);
  const { scene } = useGLTF("/glb/maple_tree.glb");
  const trees = useMemo(() => {
    return TREE_POSITIONS.slice(0, count).map((t, i) => {
      const depthFactor = THREE.MathUtils.clamp((-t.z - 8) / 210, 0, 1);
      const rootSink = TREE_ROOT_SINK;
      return {
        ...t,
        y:
          sampleVisibleTerrainHeight(t.x, t.z) +
          TREE_SURFACE_LIFT -
          rootSink +
          (t.y ?? 0),
        depthFactor,
        edgeIntersectFactor: 0,
        targetHeight: t.height,
        scaleJitter: 1,
        swaySeed: hash((i + 1) * 17.31) * Math.PI * 2,
        swayStrength: 0.005 + hash((i + 1) * 18.43) * 0.01,
        verticalSway: 0.03 + hash((i + 1) * 19.27) * 0.05,
      };
    });
  }, [count]);

  const template = useMemo(() => prepareTreeTemplate(scene), [scene]);

  const modelMetrics = useMemo(() => {
    const box = new THREE.Box3().setFromObject(template);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    return {
      height: Math.max(size.y, 0.001),
      minY: box.min.y,
      centerX: center.x,
      centerZ: center.z,
    };
  }, [template]);

  const instances = useMemo(() => {
    return trees.map((tree, i) => {
      const depthScale = THREE.MathUtils.lerp(0.9, 1.22, tree.depthFactor);
      const edgeLiftScale = 1 + tree.edgeIntersectFactor * 0.04;
      const targetHeight =
        tree.targetHeight * depthScale * tree.scaleJitter * edgeLiftScale;
      const scale = targetHeight / modelMetrics.height;
      const yaw = tree.yaw + (hash((i + 1) * 22.7) - 0.5) * 0.06;
      const offsetY = -modelMetrics.minY;

      return {
        ...tree,
        scale,
        yaw,
        baseRotX: (tree.tiltX ?? 0) * 0.55,
        baseRotZ: (tree.tiltZ ?? 0) * 0.55,
        offset: [-modelMetrics.centerX, offsetY, -modelMetrics.centerZ],
      };
    });
  }, [trees, modelMetrics]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    for (let i = 0; i < instances.length; i++) {
      const ref = swayRefs.current[i];
      if (!ref) continue;
      const tree = instances[i];
      const sway = Math.sin(t * 0.34 + tree.swaySeed) * tree.swayStrength;
      const swayB =
        Math.sin(t * 0.52 + tree.swaySeed * 1.73) * tree.swayStrength * 0.55;
      ref.rotation.x = tree.baseRotX + sway * 0.45;
      ref.rotation.y = tree.yaw + swayB * 0.4;
      ref.rotation.z = tree.baseRotZ + sway;
      ref.position.y =
        tree.y + Math.sin(t * 0.28 + tree.swaySeed) * tree.verticalSway;
    }
  });

  return (
    <group>
      {instances.map((tree, i) => (
        <group
          key={`tree-${i}`}
          ref={(node) => {
            swayRefs.current[i] = node;
          }}
          position={[tree.x, tree.y, tree.z]}
          rotation={[tree.baseRotX, tree.yaw, tree.baseRotZ]}
          scale={tree.scale}
        >
          <group position={tree.offset}>
            <Clone object={template} />
          </group>
        </group>
      ))}
    </group>
  );
}

useGLTF.preload("/glb/maple_tree.glb");
