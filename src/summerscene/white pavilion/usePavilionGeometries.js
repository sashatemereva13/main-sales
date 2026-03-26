import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { createFinCurve, createRibbonCurve } from "./curves";

export default function usePavilionGeometries() {
  const leftFinGeometry = useMemo(
    () => new THREE.TubeGeometry(createFinCurve(-1, 2), 160, 0.38, 36, false),
    [],
  );
  const rightFinGeometry = useMemo(
    () => new THREE.TubeGeometry(createFinCurve(1, 2), 160, 0.38, 36, false),
    [],
  );
  const frontRibbonGeometry = useMemo(
    () => new THREE.TubeGeometry(createRibbonCurve(0.2, 1), 220, 0.16, 28, false),
    [],
  );
  const rearRibbonGeometry = useMemo(
    () => new THREE.TubeGeometry(createRibbonCurve(Math.PI + 0.45, -1), 220, 0.14, 28, false),
    [],
  );

  useEffect(
    () => () =>
      [leftFinGeometry, rightFinGeometry, frontRibbonGeometry, rearRibbonGeometry].forEach((geometry) => geometry.dispose()),
    [leftFinGeometry, rightFinGeometry, frontRibbonGeometry, rearRibbonGeometry],
  );

  return { leftFinGeometry, rightFinGeometry, frontRibbonGeometry, rearRibbonGeometry };
}
