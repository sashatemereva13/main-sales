import { useRef } from "react";
import { WHITE_PAVILION_SCALE, WHITE_PAVILION_WORLD_POSITION } from "./constants";
import PavilionBase from "./PavilionBase";
import PavilionCrown from "./PavilionCrown";
import PavilionTower from "./PavilionTower";
import usePavilionAnimation from "./usePavilionAnimation";
import usePavilionGeometries from "./usePavilionGeometries";
import usePavilionMaterials from "./usePavilionMaterials";

export default function WhitePavilion({ preserveGlass = true }) {
  const towerRef = useRef(null);
  const crownRef = useRef(null);
  const glowRingRef = useRef(null);
  const terraceClusterRef = useRef(null);
  const materials = usePavilionMaterials(preserveGlass);
  const geometries = usePavilionGeometries();

  usePavilionAnimation({ towerRef, crownRef, glowRingRef, terraceClusterRef });

  return (
    <group position={WHITE_PAVILION_WORLD_POSITION} scale={WHITE_PAVILION_SCALE}>
      <group ref={towerRef}>
        <PavilionBase preserveGlass={preserveGlass} terraceClusterRef={terraceClusterRef} {...materials} />
        <PavilionTower {...materials} {...geometries} />
        <PavilionCrown crownRef={crownRef} glowRingRef={glowRingRef} {...materials} />
      </group>
    </group>
  );
}
