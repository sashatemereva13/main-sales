import GardenTerrace from "./GardenTerrace";

const TERRACES = [
  { position: [0, -0.32, 0], scale: [12.9, 1.4, 11.6] },
  {
    position: [-3.6, 0.72, 2.6],
    rotation: [0.04, -0.3, 0.1],
    scale: [9.2, 1.02, 6.4],
  },
  {
    position: [4.8, 1.08, -1.9],
    rotation: [-0.04, 0.45, -0.08],
    scale: [8, 0.96, 5.7],
  },
  {
    position: [-1.6, 1.86, -4.1],
    rotation: [0.08, 0.2, -0.14],
    scale: [7.2, 0.88, 4.8],
  },
  {
    position: [2.8, 2.22, 3.4],
    rotation: [-0.02, -0.35, 0.12],
    scale: [6.1, 0.82, 4.1],
  },
];

export default function TerraceCluster({
  groupRef,
  shellMaterial,
  lawnMaterial,
  rimMaterial,
}) {
  return (
    <group ref={groupRef} position={[0, 0.25, 0]}>
      {TERRACES.map((terrace, index) => (
        <GardenTerrace
          key={`terrace-${index}`}
          {...terrace}
          shellMaterial={shellMaterial}
          lawnMaterial={lawnMaterial}
          rimMaterial={rimMaterial}
        />
      ))}
    </group>
  );
}
