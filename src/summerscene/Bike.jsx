import { useEffect, useMemo } from "react";
import { Clone, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const GROUND_MESH_Y = -1.52;

function sampleGroundHeight(x, z) {
  const swellA = Math.sin(x * 0.016) * Math.cos(z * 0.014) * 0.78;
  const swellB = Math.sin((x + z) * 0.009) * 0.56;
  const swellC = Math.cos((x - z) * 0.007) * 0.42;
  const micro = Math.sin(x * 0.07 + z * 0.045) * 0.07;
  return swellA + swellB + swellC + micro - 0.22 + GROUND_MESH_Y;
}

function prepareBikeTemplate(scene) {
  const root = scene.clone(true);
  root.traverse((child) => {
    if (!child.isMesh) return;
    child.castShadow = true;
    child.receiveShadow = true;
    child.frustumCulled = false;

    if (!child.material) return;
    if (Array.isArray(child.material)) {
      child.material = child.material.map((m) => m.clone());
    } else {
      child.material = child.material.clone();
    }
  });
  return root;
}

export default function Bike({
  position = [23.5, 0, -9.5],
  rotation = [0, -1.15, 0.08],
  targetLength = 2.35,
}) {
  const { scene } = useGLTF("/glb/bike.glb");

  const template = useMemo(() => prepareBikeTemplate(scene), [scene]);

  const fitted = useMemo(() => {
    const box = new THREE.Box3().setFromObject(template);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const baseLength = Math.max(size.x, size.z, 0.001);
    const scale = targetLength / baseLength;
    const groundY = sampleGroundHeight(position[0], position[2]) + 0.01;
    const offsetY = -box.min.y * scale;

    return {
      scale,
      worldY: groundY + offsetY,
      groundLocalY: -offsetY + 0.01,
      offset: [-center.x, 0, -center.z],
    };
  }, [template, targetLength, position]);

  useEffect(() => {
    template.traverse((child) => {
      if (!child.isMesh) return;
      if (!child.material) return;

      const tweak = (mat) => {
        if (mat.color) mat.color.multiplyScalar(0.95);
        if (mat.roughness !== undefined) mat.roughness = Math.min(1, mat.roughness + 0.08);
        if (mat.metalness !== undefined) mat.metalness = Math.max(0, mat.metalness * 0.85);
        mat.needsUpdate = true;
      };

      if (Array.isArray(child.material)) child.material.forEach(tweak);
      else tweak(child.material);
    });
  }, [template]);

  return (
    <group
      position={[position[0], fitted.worldY, position[2]]}
      rotation={rotation}
      scale={fitted.scale}
    >
      <mesh
        position={[0, fitted.groundLocalY, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[1.85, 0.95, 1]}
        renderOrder={0}
      >
        <circleGeometry args={[1, 48]} />
        <meshBasicMaterial
          color="#2f2a1d"
          transparent
          opacity={0.17}
          depthWrite={false}
        />
      </mesh>

      <group position={fitted.offset}>
        <Clone object={template} />
      </group>
    </group>
  );
}

useGLTF.preload("/glb/bike.glb");
