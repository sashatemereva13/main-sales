import { useRef } from "react";
import {
  WHITE_PAVILION_SCALE,
  WHITE_PAVILION_WORLD_POSITION,
} from "./constants";
import SanctuaryBase from "./SanctuaryBase";
import SanctuaryFacade from "./SanctuaryFacade";
import SanctuarySpire from "./SanctuarySpire";
import useSanctuaryAnimation from "./useSanctuaryAnimation";
import useSanctuaryGeometries from "./useSanctuaryGeometries";
import useSanctuaryMaterials from "./useSanctuaryMaterials";

export default function WhitePavilion({ preserveGlass = true }) {
  const crownRef = useRef(null);
  const portalGlowRef = useRef(null);
  const materials = useSanctuaryMaterials(preserveGlass);
  const geometries = useSanctuaryGeometries();

  useSanctuaryAnimation({ crownRef, portalGlowRef });

  return (
    <group
      position={WHITE_PAVILION_WORLD_POSITION}
      scale={WHITE_PAVILION_SCALE}
    >
      <SanctuaryBase {...materials} {...geometries} />
      <SanctuaryFacade
        portalGlowRef={portalGlowRef}
        {...materials}
        {...geometries}
      />
      <SanctuarySpire crownRef={crownRef} {...materials} {...geometries} />
    </group>
  );
}
