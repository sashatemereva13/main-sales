import { useMemo } from "react";
import * as THREE from "three";
import {
  FOREST_BACKDROP_OFFSET,
  sampleForestSurfaceHeight,
} from "./terrainSurface";

function makeRidgeGeometry() {
  const geo = new THREE.PlaneGeometry(520, 260, 120, 80);
  geo.rotateX(-Math.PI / 2);

  const pos = geo.attributes.position;
  const colors = [];

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const worldX = x + FOREST_BACKDROP_OFFSET.x;
    const worldZ = z + FOREST_BACKDROP_OFFSET.z;
    const localZ = worldZ - FOREST_BACKDROP_OFFSET.z;
    const backBand = Math.exp(-Math.pow((localZ + 84) / 54, 2));
    const ridge =
      backBand *
      (12.5 + Math.sin(worldX * 0.03) * 3.6 + Math.cos(worldX * 0.017) * 2.8);
    const shoulder =
      Math.exp(-Math.pow((localZ + 124) / 42, 2)) *
      (8.2 + Math.sin(worldX * 0.02 + 1.4) * 2.1);
    const taper = Math.exp(-Math.pow((localZ + 18) / 104, 2)) * 0.9;
    const ridgeOnly = ridge + shoulder - taper;
    const y =
      sampleForestSurfaceHeight(worldX, worldZ) - FOREST_BACKDROP_OFFSET.y;

    pos.setY(i, y);
  }

  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

export default function ForestBackdrop() {
  const ridgeGeometry = useMemo(() => makeRidgeGeometry(), []);

  return (
    <group>
      {/* <mesh
        geometry={ridgeGeometry}
        position={[
          FOREST_BACKDROP_OFFSET.x,
          FOREST_BACKDROP_OFFSET.y,
          FOREST_BACKDROP_OFFSET.z,
        ]}
        receiveShadow
        frustumCulled={false}
      >
        <meshStandardMaterial
          vertexColors
          roughness={0.69}
          metalness={0}
          color="#7aa577"
          emissive="#def1e1"
          emissiveIntensity={0.02}
        />
      </mesh> */}
    </group>
  );
}
