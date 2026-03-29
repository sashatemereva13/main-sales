import ToonOutlineMesh from "./ToonOutlineMesh";

export default function SanctuaryBase({
  shellMaterial,
  trimMaterial,
  mossMaterial,
  shadowMaterial,
  accentMaterial,
  outlineMaterial,
  baseBodyGeometry,
  mossPadGeometry,
  stairGeometry,
  leftRootGeometry,
  rightRootGeometry,
  leftBalconyGeometry,
  rightBalconyGeometry,
}) {
  return (
    <group position={[0, -3, 0]}>
      <mesh
        geometry={baseBodyGeometry}
        material={shellMaterial}
        castShadow
        receiveShadow
      />
      <ToonOutlineMesh
        geometry={baseBodyGeometry}
        outlineMaterial={outlineMaterial}
        thickness={1.025}
      />
      <mesh geometry={mossPadGeometry} material={mossMaterial} receiveShadow />

      <mesh position={[0, 0.26, 11.4]} material={shadowMaterial} receiveShadow>
        <boxGeometry args={[3.2, 0.72, 7.8]} />
      </mesh>
      <mesh
        geometry={stairGeometry}
        material={trimMaterial}
        castShadow
        receiveShadow
      />
      <mesh position={[0, 0.34, 14.8]} material={trimMaterial}>
        <boxGeometry args={[0.86, 0.08, 4.1]} />
      </mesh>
      <mesh position={[0, 0.08, 17.1]} material={accentMaterial}>
        <boxGeometry args={[0.52, 0.08, 2.8]} />
      </mesh>

      <mesh
        geometry={leftRootGeometry}
        material={trimMaterial}
        castShadow
        receiveShadow
      />
      <ToonOutlineMesh
        geometry={leftRootGeometry}
        outlineMaterial={outlineMaterial}
        thickness={1.032}
      />
      <mesh
        geometry={rightRootGeometry}
        material={trimMaterial}
        castShadow
        receiveShadow
      />
      <ToonOutlineMesh
        geometry={rightRootGeometry}
        outlineMaterial={outlineMaterial}
        thickness={1.032}
      />

      <mesh
        position={[-7.1, 3.0, -4.8]}
        rotation={[0.08, 0.38, -0.08]}
        material={mossMaterial}
        receiveShadow
      >
        <cylinderGeometry args={[2.6, 3.4, 0.44, 8]} />
      </mesh>
      <mesh
        position={[7.1, 3.0, -5.4]}
        rotation={[-0.08, -0.42, 0.08]}
        material={mossMaterial}
        receiveShadow
      >
        <cylinderGeometry args={[2.5, 3.2, 0.42, 8]} />
      </mesh>

      <mesh geometry={leftBalconyGeometry} material={trimMaterial} />
      <mesh geometry={rightBalconyGeometry} material={trimMaterial} />
      <ToonOutlineMesh
        geometry={leftBalconyGeometry}
        outlineMaterial={outlineMaterial}
        thickness={1.05}
      />
      <ToonOutlineMesh
        geometry={rightBalconyGeometry}
        outlineMaterial={outlineMaterial}
        thickness={1.05}
      />
    </group>
  );
}
