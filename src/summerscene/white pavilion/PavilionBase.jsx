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
        <cylinderGeometry args={[10.8, 13.6, 2.5, 88]} />
      </mesh>
      <mesh position={[0, 0.74, 0]} material={whiteFrameMaterial}>
        <torusGeometry args={[10.05, 0.38, 28, 180]} />
      </mesh>
      <mesh position={[0, 0.82, 0]} material={lawnMaterial} receiveShadow>
        <cylinderGeometry args={[9.35, 11.65, 0.54, 88]} />
      </mesh>
      <mesh
        position={[0, 2.18, 0]}
        material={shellMaterial}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[7.8, 9.3, 3.15, 72]} />
      </mesh>
      <mesh position={[0, 2.9, 1.56]} material={glassMaterial}>
        <cylinderGeometry args={[3.55, 4.3, 1.68, 72, 1, false, 0, Math.PI]} />
      </mesh>
      <EntryScreen preserveGlass={preserveGlass} />
    </>
  );
}
