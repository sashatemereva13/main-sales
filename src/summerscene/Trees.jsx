import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Clone, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { sampleVisibleTerrainHeight } from "./terrainSurface";

const TREE_SURFACE_LIFT = 4.04;
const TREE_ROOT_SINK = 0.1;
const TREE_POSITIONS = [
  // Edit these 5 entries to move trees: x (left/right), z (depth), y (height offset), yaw (rotation), height (visual size).
  {
    x: 4,
    y: -4.5,
    z: -25,
    yaw: 0.95,
    height: 33.5,
    tiltX: -0.01,
    tiltZ: 0.012,
  },
  {
    x: 80,
    y: -7,
    z: -4,
    yaw: 4.15,
    height: 40.5,
    tiltX: 0.012,
    tiltZ: -0.01,
  },
  {
    x: -58,
    y: -8,
    z: -74,
    yaw: 1.72,
    height: 100.2,
    tiltX: -0.008,
    tiltZ: 0.01,
  },
  { x: 54, y: -3, z: -68, yaw: 2.56, height: 18.1, tiltX: 0.01, tiltZ: -0.012 },
  {
    x: -30,
    y: -6,
    z: -74,
    yaw: 5.35,
    height: 31.4,
    tiltX: -0.006,
    tiltZ: 0.006,
  },
];

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
      const depthScale = THREE.MathUtils.lerp(0.96, 1.14, tree.depthFactor);
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
