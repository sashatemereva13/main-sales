function toScaleVector(scale, thickness) {
  if (Array.isArray(scale)) {
    return [
      (scale[0] ?? 1) * thickness,
      (scale[1] ?? 1) * thickness,
      (scale[2] ?? 1) * thickness,
    ];
  }
  const s = typeof scale === "number" ? scale : 1;
  return [s * thickness, s * thickness, s * thickness];
}

export default function ToonOutlineMesh({
  geometry,
  outlineMaterial,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  thickness = 1.03,
}) {
  if (!geometry || !outlineMaterial) return null;

  return (
    <mesh
      geometry={geometry}
      material={outlineMaterial}
      position={position}
      rotation={rotation}
      scale={toScaleVector(scale, thickness)}
      renderOrder={-2}
      frustumCulled={false}
    />
  );
}
