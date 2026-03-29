import ToonOutlineMesh from "./ToonOutlineMesh";

export default function SanctuarySpire({
  crownRef,
  upperBodyGeometry,
  leftSpirePetalGeometry,
  rightSpirePetalGeometry,
  leftNeedleSpireGeometry,
  rightNeedleSpireGeometry,
  leftVeilWingGeometry,
  rightVeilWingGeometry,
  crownRingGeometry,
  crownHaloGeometry,
  shellMaterial,
  trimMaterial,
  glassMaterial,
  glowMaterial,
  outlineMaterial,
}) {
  return (
    <group ref={crownRef}>
      <mesh
        geometry={upperBodyGeometry}
        material={shellMaterial}
        castShadow
        receiveShadow
      />
      <ToonOutlineMesh
        geometry={upperBodyGeometry}
        outlineMaterial={outlineMaterial}
        thickness={1.024}
      />

      <mesh
        geometry={leftSpirePetalGeometry}
        material={trimMaterial}
        castShadow
      />
      <ToonOutlineMesh
        geometry={leftSpirePetalGeometry}
        outlineMaterial={outlineMaterial}
        thickness={1.038}
      />
      <mesh
        geometry={rightSpirePetalGeometry}
        material={trimMaterial}
        castShadow
      />
      <ToonOutlineMesh
        geometry={rightSpirePetalGeometry}
        outlineMaterial={outlineMaterial}
        thickness={1.038}
      />
      <mesh
        geometry={leftNeedleSpireGeometry}
        material={trimMaterial}
        castShadow
      />
      <ToonOutlineMesh
        geometry={leftNeedleSpireGeometry}
        outlineMaterial={outlineMaterial}
        thickness={1.06}
      />
      <mesh
        geometry={rightNeedleSpireGeometry}
        material={trimMaterial}
        castShadow
      />
      <ToonOutlineMesh
        geometry={rightNeedleSpireGeometry}
        outlineMaterial={outlineMaterial}
        thickness={1.06}
      />
      <mesh
        geometry={leftVeilWingGeometry}
        material={trimMaterial}
        castShadow
      />
      <ToonOutlineMesh
        geometry={leftVeilWingGeometry}
        outlineMaterial={outlineMaterial}
        thickness={1.045}
      />
      <mesh
        geometry={rightVeilWingGeometry}
        material={trimMaterial}
        castShadow
      />
      <ToonOutlineMesh
        geometry={rightVeilWingGeometry}
        outlineMaterial={outlineMaterial}
        thickness={1.045}
      />

      <mesh position={[0, 39.8, -6.6]} material={trimMaterial} castShadow>
        <coneGeometry args={[0.92, 18.8, 10]} />
      </mesh>
      <mesh
        position={[0, 24.8, -6.0]}
        rotation={[Math.PI / 2, 0.12, 0]}
        geometry={crownRingGeometry}
        material={trimMaterial}
      />
      <ToonOutlineMesh
        position={[0, 24.8, -6.0]}
        rotation={[Math.PI / 2, 0.12, 0]}
        geometry={crownRingGeometry}
        outlineMaterial={outlineMaterial}
        thickness={1.05}
      />
      <mesh
        position={[0, 24.9, -6.0]}
        rotation={[Math.PI / 2, 0.12, 0]}
        geometry={crownHaloGeometry}
        material={glowMaterial}
      />
      <mesh position={[0, 25.6, -6.2]} material={glassMaterial}>
        <cylinderGeometry args={[0.34, 0.56, 16.6, 12]} />
      </mesh>
      <mesh position={[0, 18.4, -5.8]} material={glowMaterial}>
        <torusGeometry args={[1.14, 0.06, 20, 120]} />
      </mesh>
      <mesh position={[0, 10.2, -8.2]} material={glowMaterial}>
        <sphereGeometry args={[0.34, 20, 18]} />
      </mesh>
    </group>
  );
}
