import { useMemo } from "react";
import * as THREE from "three";
import {
  MEADOW_ISLAND_CENTER,
  MEADOW_ISLAND_RADIUS,
} from "./meadowIslandConfig";
import { sampleMeadowSurfaceHeight } from "./terrainSurface";

export default function Ground() {
  const { topGeometry, undersideGeometry } = useMemo(() => {
    const geo = new THREE.CircleGeometry(MEADOW_ISLAND_RADIUS, 96, 0, Math.PI * 2);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const colors = [];
    const color = new THREE.Color();
    const baseGreen = new THREE.Color("#507f2f");
    const lushGreen = new THREE.Color();
    const flowerTint = new THREE.Color();

    for (let i = 0; i < pos.count; i += 1) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const worldX = x + MEADOW_ISLAND_CENTER[0];
      const worldZ = z + MEADOW_ISLAND_CENTER[1];
      const radial = Math.sqrt(x * x + z * z);

      pos.setY(i, sampleMeadowSurfaceHeight(worldX, worldZ) + 0.04);

      const innerMask =
        1 - THREE.MathUtils.smoothstep(0, MEADOW_ISLAND_RADIUS, radial);
      const patchwork =
        Math.sin(worldX * 0.038) * Math.cos(worldZ * 0.034) * 0.5 + 0.5;
      const terraceBands =
        Math.sin(worldZ * 0.11 + worldX * 0.03) * 0.5 + 0.5;
      const contourLift = Math.exp(
        -Math.pow(
          (radial - (MEADOW_ISLAND_RADIUS * (0.24 + patchwork * 0.5))) / 12,
          2,
        ),
      );
      const flowerRibbonA = Math.exp(
        -Math.pow(
          (Math.sin(worldX * 0.058) * 16 + worldZ * 0.36 + 12) / 3.6,
          2,
        ),
      );
      const flowerRibbonB = Math.exp(
        -Math.pow(
          (Math.cos(worldZ * 0.062) * 14 - worldX * 0.28 - 3) / 4.2,
          2,
        ),
      );
      const flowerRibbonC = Math.exp(
        -Math.pow(
          (Math.sin((worldX + worldZ) * 0.04) * 18 + worldZ * 0.22 - 24) / 4.6,
          2,
        ),
      );
      const blossomBands = Math.max(flowerRibbonA, flowerRibbonB, flowerRibbonC);

      lushGreen.setRGB(
        THREE.MathUtils.lerp(0.16, 0.24, patchwork),
        THREE.MathUtils.lerp(0.4, 0.62, terraceBands),
        THREE.MathUtils.lerp(0.06, 0.14, patchwork),
      );

      color.copy(baseGreen).lerp(lushGreen, 0.66 + innerMask * 0.18);
      color.multiplyScalar(THREE.MathUtils.lerp(0.97, 1.09, contourLift));

      if (blossomBands > 0.08) {
        flowerTint.set(blossomBands > 0.52 ? "#f6afc8" : "#f4c7da");
        color.lerp(
          flowerTint,
          THREE.MathUtils.clamp(blossomBands * 0.34, 0, 0.28),
        );
      }

      const rimFade = THREE.MathUtils.smoothstep(
        MEADOW_ISLAND_RADIUS * 0.82,
        MEADOW_ISLAND_RADIUS,
        radial,
      );
      color.multiplyScalar(THREE.MathUtils.lerp(1.01, 0.98, rimFade));

      colors.push(color.r, color.g, color.b);
    }

    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    pos.needsUpdate = true;
    geo.computeVertexNormals();

    const lowerShell = new THREE.SphereGeometry(
      MEADOW_ISLAND_RADIUS * 0.99,
      96,
      48,
      0,
      Math.PI * 2,
      Math.PI / 2,
      Math.PI / 2,
    );

    return {
      topGeometry: geo,
      undersideGeometry: lowerShell,
    };
  }, []);

  return (
    <group position={[MEADOW_ISLAND_CENTER[0], 0, MEADOW_ISLAND_CENTER[1]]}>
      <mesh
        geometry={topGeometry}
        receiveShadow
        frustumCulled={false}
      >
        <meshStandardMaterial
          vertexColors
          roughness={1}
          metalness={0}
          emissive="#29461f"
          emissiveIntensity={0.08}
        />
      </mesh>

      <mesh
        geometry={undersideGeometry}
        position={[0, -1.6, 0]}
        scale={[1, 0.74, 1]}
        castShadow
        receiveShadow
        frustumCulled={false}
      >
        <meshStandardMaterial
          color="#3f5d2a"
          roughness={0.98}
          metalness={0}
          emissive="#1d170f"
          emissiveIntensity={0.02}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
