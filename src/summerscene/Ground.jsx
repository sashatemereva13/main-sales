import { useMemo } from "react";
import * as THREE from "three";

export default function Ground() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(460, 460, 160, 160);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const colors = [];
    const color = new THREE.Color();

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // More pronounced rolling meadow with soft long swells.
      const swellA = Math.sin(x * 0.016) * Math.cos(z * 0.014) * 0.78;
      const swellB = Math.sin((x + z) * 0.009) * 0.56;
      const swellC = Math.cos((x - z) * 0.007) * 0.42;
      const micro = Math.sin(x * 0.07 + z * 0.045) * 0.07;
      const y = swellA + swellB + swellC + micro - 0.22;

      pos.setY(i, y);

      const sunPatch =
        0.5 +
        0.22 * Math.sin(x * 0.013 - z * 0.008) +
        0.2 * Math.cos(z * 0.017 + x * 0.006) +
        0.08 * Math.sin((x + z) * 0.03);

      const grassTint = THREE.MathUtils.clamp(sunPatch, 0, 1);
      color.setRGB(
        THREE.MathUtils.lerp(0.16, 0.3, grassTint),
        THREE.MathUtils.lerp(0.3, 0.58, grassTint),
        THREE.MathUtils.lerp(0.1, 0.17, grassTint),
      );

      colors.push(color.r, color.g, color.b);
    }

    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    pos.needsUpdate = true;
    geo.computeVertexNormals();

    return geo;
  }, []);

  return (
    <mesh
      geometry={geometry}
      position={[0, -0.12, -8]}
      receiveShadow
      frustumCulled={false}
    >
      <meshStandardMaterial
        vertexColors
        color="#4b9a35"
        roughness={0.98}
        metalness={0}
        emissive="#bdf08f"
        emissiveIntensity={0.11}
      />
    </mesh>
  );
}
