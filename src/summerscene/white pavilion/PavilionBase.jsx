import EntryScreen from "./EntryScreen";
import TerraceCluster from "./TerraceCluster";

export default function PavilionBase({
  preserveGlass,
  terraceClusterRef,
  shellMaterial,
  whiteFrameMaterial,
  glassMaterial,
  lawnMaterial,
  terraceRimMaterial,
}) {
  return (
    <>
      <TerraceCluster
        groupRef={terraceClusterRef}
        shellMaterial={shellMaterial}
        lawnMaterial={lawnMaterial}
        rimMaterial={terraceRimMaterial}
      />
      <mesh position={[0, 0.22, 0]} material={shellMaterial} receiveShadow>
        <cylinderGeometry args={[8.9, 11.1, 2.34, 88]} />
      </mesh>
      <mesh position={[0, 0.74, 0]} material={whiteFrameMaterial}>
        <torusGeometry args={[8.45, 0.34, 28, 180]} />
      </mesh>
      <mesh position={[0, 0.82, 0]} material={lawnMaterial} receiveShadow>
        <cylinderGeometry args={[7.85, 9.65, 0.48, 88]} />
      </mesh>
      <mesh
        position={[0, 2.08, 0]}
        material={shellMaterial}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[6.1, 7.5, 2.9, 72]} />
      </mesh>
      <mesh position={[0, 2.74, 1.28]} material={glassMaterial}>
        <cylinderGeometry args={[3.05, 3.72, 1.52, 72, 1, false, 0, Math.PI]} />
      </mesh>
      <EntryScreen preserveGlass={preserveGlass} />
    </>
  );
}
