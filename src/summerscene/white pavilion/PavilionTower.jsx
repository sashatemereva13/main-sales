function VerticalRibbon({ geometry, material, rotationY = 0 }) {
  return (
    <mesh
      geometry={geometry}
      material={material}
      rotation={[0, rotationY, 0]}
    />
  );
}

export default function PavilionTower({
  shellMaterial,
  glassMaterial,
  lawnMaterial,
  leftFinGeometry,
  rightFinGeometry,
  frontRibbonGeometry,
  rearRibbonGeometry,
}) {
  return (
    <>
      <mesh
        position={[0, 9.4, 0]}
        material={glassMaterial}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.94, 1.52, 16.8, 52]} />
      </mesh>
      <mesh
        position={[-0.52, 9.8, -0.12]}
        rotation={[0, 0, 0.06]}
        material={shellMaterial}
        castShadow
      >
        <cylinderGeometry args={[0.34, 0.72, 18.4, 44]} />
      </mesh>
      <mesh
        position={[0.56, 9.6, 0.1]}
        rotation={[0, 0, -0.06]}
        material={shellMaterial}
        castShadow
      >
        <cylinderGeometry args={[0.34, 0.72, 18.1, 44]} />
      </mesh>
      <mesh geometry={leftFinGeometry} material={shellMaterial} castShadow />
      <mesh geometry={rightFinGeometry} material={shellMaterial} castShadow />
      <VerticalRibbon geometry={frontRibbonGeometry} material={lawnMaterial} />
      <VerticalRibbon geometry={rearRibbonGeometry} material={lawnMaterial} />
    </>
  );
}
