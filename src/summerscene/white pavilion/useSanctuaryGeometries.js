import { useEffect, useMemo } from "react";
import * as THREE from "three";
import {
  createBalconyCurve,
  createDoorLeafShape,
  createElvenArchShape,
  createFrontRibCurve,
  createMidRibCurve,
  createNeedleSpireCurve,
  createSideRootCurve,
  createSpirePetalCurve,
  createVeilWingCurve,
} from "./sanctuaryCurves";

function createSpireProfile() {
  return [
    new THREE.Vector2(0.22, 0),
    new THREE.Vector2(2.2, 2.8),
    new THREE.Vector2(4.6, 8.2),
    new THREE.Vector2(5.8, 15.8),
    new THREE.Vector2(5.2, 25.6),
    new THREE.Vector2(3.9, 35.4),
    new THREE.Vector2(2.1, 45.8),
    new THREE.Vector2(0.9, 54.6),
    new THREE.Vector2(0.2, 61.8),
    new THREE.Vector2(0, 63.8),
  ];
}

export default function useSanctuaryGeometries() {
  const baseBodyGeometry = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(8.2, 13.8, 8.6, 12, 5, false);
    geometry.translate(0, 4.3, -1.6);
    return geometry;
  }, []);

  const upperBodyGeometry = useMemo(() => {
    const geometry = new THREE.LatheGeometry(createSpireProfile(), 36);
    geometry.scale(0.92, 1, 0.88);
    geometry.translate(0, 2.2, -4.2);
    return geometry;
  }, []);

  const frontArchOuterGeometry = useMemo(
    () =>
      new THREE.ExtrudeGeometry(
        createElvenArchShape({ width: 9.2, height: 15.6, innerInset: 0.68 }),
        {
          depth: 0.86,
          bevelEnabled: true,
          bevelSegments: 3,
          steps: 1,
          bevelSize: 0.16,
          bevelThickness: 0.12,
        },
      ),
    [],
  );

  const frontArchInnerGeometry = useMemo(
    () =>
      new THREE.ExtrudeGeometry(
        createElvenArchShape({ width: 6.1, height: 11.8, innerInset: 0.48 }),
        {
          depth: 0.58,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: 0.1,
          bevelThickness: 0.08,
        },
      ),
    [],
  );

  const sideArchGeometry = useMemo(
    () =>
      new THREE.ExtrudeGeometry(
        createElvenArchShape({ width: 4.5, height: 7.8, innerInset: 0.4 }),
        {
          depth: 0.4,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: 0.08,
          bevelThickness: 0.06,
        },
      ),
    [],
  );

  const doorFrameGeometry = useMemo(
    () =>
      new THREE.ExtrudeGeometry(createDoorLeafShape(3.1, 7.4), {
        depth: 0.24,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.07,
        bevelThickness: 0.06,
      }),
    [],
  );

  const doorLeafGeometry = useMemo(
    () =>
      new THREE.ExtrudeGeometry(createDoorLeafShape(2.34, 6.6), {
        depth: 0.1,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.05,
        bevelThickness: 0.035,
      }),
    [],
  );

  const leftRootGeometry = useMemo(
    () => new THREE.TubeGeometry(createSideRootCurve(-1), 180, 0.36, 18, false),
    [],
  );
  const rightRootGeometry = useMemo(
    () => new THREE.TubeGeometry(createSideRootCurve(1), 180, 0.36, 18, false),
    [],
  );
  const leftFrontRibGeometry = useMemo(
    () => new THREE.TubeGeometry(createFrontRibCurve(-1), 200, 0.18, 16, false),
    [],
  );
  const rightFrontRibGeometry = useMemo(
    () => new THREE.TubeGeometry(createFrontRibCurve(1), 200, 0.18, 16, false),
    [],
  );
  const leftMidRibGeometry = useMemo(
    () => new THREE.TubeGeometry(createMidRibCurve(-1), 220, 0.11, 14, false),
    [],
  );
  const rightMidRibGeometry = useMemo(
    () => new THREE.TubeGeometry(createMidRibCurve(1), 220, 0.11, 14, false),
    [],
  );
  const leftSpirePetalGeometry = useMemo(
    () => new THREE.TubeGeometry(createSpirePetalCurve(-1), 220, 0.12, 14, false),
    [],
  );
  const rightSpirePetalGeometry = useMemo(
    () => new THREE.TubeGeometry(createSpirePetalCurve(1), 220, 0.12, 14, false),
    [],
  );
  const leftNeedleSpireGeometry = useMemo(
    () => new THREE.TubeGeometry(createNeedleSpireCurve(-1), 260, 0.09, 12, false),
    [],
  );
  const rightNeedleSpireGeometry = useMemo(
    () => new THREE.TubeGeometry(createNeedleSpireCurve(1), 260, 0.09, 12, false),
    [],
  );
  const leftVeilWingGeometry = useMemo(
    () => new THREE.TubeGeometry(createVeilWingCurve(-1), 220, 0.13, 12, false),
    [],
  );
  const rightVeilWingGeometry = useMemo(
    () => new THREE.TubeGeometry(createVeilWingCurve(1), 220, 0.13, 12, false),
    [],
  );
  const leftBalconyGeometry = useMemo(
    () => new THREE.TubeGeometry(createBalconyCurve(-1), 120, 0.08, 12, false),
    [],
  );
  const rightBalconyGeometry = useMemo(
    () => new THREE.TubeGeometry(createBalconyCurve(1), 120, 0.08, 12, false),
    [],
  );

  const mossPadGeometry = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(6.8, 10.8, 0.56, 10);
    geometry.translate(0, 3.42, -2.8);
    return geometry;
  }, []);

  const stairGeometry = useMemo(() => {
    const geometry = new THREE.BoxGeometry(2.2, 0.28, 10.6);
    geometry.translate(0, 0.14, 10.8);
    return geometry;
  }, []);

  const innerTraceryGeometry = useMemo(
    () =>
      new THREE.ExtrudeGeometry(
        createElvenArchShape({ width: 3.8, height: 8.6, innerInset: 0.3 }),
        {
          depth: 0.22,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: 0.05,
          bevelThickness: 0.045,
        },
      ),
    [],
  );

  const crownRingGeometry = useMemo(
    () => new THREE.TorusGeometry(1.94, 0.07, 16, 180),
    [],
  );

  const crownHaloGeometry = useMemo(
    () => new THREE.TorusGeometry(2.84, 0.05, 16, 180),
    [],
  );

  const allGeometries = [
    baseBodyGeometry,
    upperBodyGeometry,
    frontArchOuterGeometry,
    frontArchInnerGeometry,
    sideArchGeometry,
    doorFrameGeometry,
    doorLeafGeometry,
    leftRootGeometry,
    rightRootGeometry,
    leftFrontRibGeometry,
    rightFrontRibGeometry,
    leftMidRibGeometry,
    rightMidRibGeometry,
    leftSpirePetalGeometry,
    rightSpirePetalGeometry,
    leftNeedleSpireGeometry,
    rightNeedleSpireGeometry,
    leftVeilWingGeometry,
    rightVeilWingGeometry,
    leftBalconyGeometry,
    rightBalconyGeometry,
    mossPadGeometry,
    stairGeometry,
    innerTraceryGeometry,
    crownRingGeometry,
    crownHaloGeometry,
  ];

  useEffect(
    () => () => allGeometries.forEach((geometry) => geometry.dispose()),
    [allGeometries],
  );

  return {
    baseBodyGeometry,
    upperBodyGeometry,
    frontArchOuterGeometry,
    frontArchInnerGeometry,
    sideArchGeometry,
    doorFrameGeometry,
    doorLeafGeometry,
    leftRootGeometry,
    rightRootGeometry,
    leftFrontRibGeometry,
    rightFrontRibGeometry,
    leftMidRibGeometry,
    rightMidRibGeometry,
    leftSpirePetalGeometry,
    rightSpirePetalGeometry,
    leftNeedleSpireGeometry,
    rightNeedleSpireGeometry,
    leftVeilWingGeometry,
    rightVeilWingGeometry,
    leftBalconyGeometry,
    rightBalconyGeometry,
    mossPadGeometry,
    stairGeometry,
    innerTraceryGeometry,
    crownRingGeometry,
    crownHaloGeometry,
  };
}
