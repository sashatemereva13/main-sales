import * as THREE from "three";

function makeMirroredPoints(side, points) {
  return points.map(([x, y, z]) => new THREE.Vector3(x * side, y, z));
}

export function createSideRootCurve(side = 1, spread = 1) {
  return new THREE.CatmullRomCurve3(
    makeMirroredPoints(side, [
      [2.6 * spread, 0.8, 11.6],
      [4.8 * spread, 2.3, 8.8],
      [7.2 * spread, 5.6, 4.6],
      [8.9 * spread, 10.8, -1.2],
      [7.2 * spread, 18.4, -8.8],
      [4.3 * spread, 29.2, -16.8],
    ]),
    false,
    "catmullrom",
    0.5,
  );
}

export function createFrontRibCurve(side = 1, lean = 1) {
  return new THREE.CatmullRomCurve3(
    makeMirroredPoints(side, [
      [0.92, 0.4, 13.2],
      [1.9, 3.2, 10.6],
      [2.8, 8.4, 6.8],
      [2.35, 15.4, 1.2],
      [1.38, 24.2, -3.4 * lean],
      [0.42, 36.8, -8.8 * lean],
    ]),
    false,
    "catmullrom",
    0.54,
  );
}

export function createSpirePetalCurve(side = 1, sweep = 1) {
  return new THREE.CatmullRomCurve3(
    makeMirroredPoints(side, [
      [0.84, 18.4, -7.6],
      [1.95, 25.2, -9.8],
      [1.52, 33.6, -8.2],
      [0.56, 42.8, -5.3],
      [0.12, 51.8, -2.1 * sweep],
    ]),
    false,
    "catmullrom",
    0.5,
  );
}

export function createBalconyCurve(side = 1) {
  return new THREE.CatmullRomCurve3(
    makeMirroredPoints(side, [
      [3.8, 2.8, 0.2],
      [5.3, 3.2, -1.6],
      [7.2, 3.25, -4.1],
      [8.5, 2.95, -7.4],
    ]),
    false,
    "catmullrom",
    0.4,
  );
}

export function createElvenArchShape({
  width = 5,
  height = 8,
  innerInset = 0,
}) {
  const half = width * 0.5;
  const shape = new THREE.Shape();
  shape.moveTo(-half, 0);
  shape.bezierCurveTo(
    -half * 1.02,
    height * 0.24,
    -half * 0.96,
    height * 0.62,
    -half * 0.42,
    height * 0.88,
  );
  shape.bezierCurveTo(
    -half * 0.16,
    height * 1.02,
    -half * 0.06,
    height * 1.06,
    0,
    height,
  );
  shape.bezierCurveTo(
    half * 0.06,
    height * 1.06,
    half * 0.16,
    height * 1.02,
    half * 0.42,
    height * 0.88,
  );
  shape.bezierCurveTo(
    half * 0.96,
    height * 0.62,
    half * 1.02,
    height * 0.24,
    half,
    0,
  );
  shape.lineTo(-half, 0);

  if (innerInset > 0) {
    const innerHalf = half - innerInset;
    const innerHeight = height - innerInset * 1.22;
    const hole = new THREE.Path();
    hole.moveTo(-innerHalf, innerInset * 0.45);
    hole.bezierCurveTo(
      -innerHalf * 0.98,
      innerHeight * 0.2,
      -innerHalf * 0.9,
      innerHeight * 0.56,
      -innerHalf * 0.4,
      innerHeight * 0.84,
    );
    hole.bezierCurveTo(
      -innerHalf * 0.12,
      innerHeight * 0.98,
      -innerHalf * 0.04,
      innerHeight * 1.02,
      0,
      innerHeight,
    );
    hole.bezierCurveTo(
      innerHalf * 0.04,
      innerHeight * 1.02,
      innerHalf * 0.12,
      innerHeight * 0.98,
      innerHalf * 0.4,
      innerHeight * 0.84,
    );
    hole.bezierCurveTo(
      innerHalf * 0.9,
      innerHeight * 0.56,
      innerHalf * 0.98,
      innerHeight * 0.2,
      innerHalf,
      innerInset * 0.45,
    );
    hole.lineTo(-innerHalf, innerInset * 0.45);
    shape.holes.push(hole);
  }

  return shape;
}

export function createDoorLeafShape(width = 2.75, height = 5.9) {
  const half = width * 0.5;
  const shape = new THREE.Shape();
  shape.moveTo(-half, 0);
  shape.bezierCurveTo(
    -half * 0.95,
    height * 0.22,
    -half * 0.9,
    height * 0.68,
    -half * 0.26,
    height * 0.94,
  );
  shape.bezierCurveTo(
    -half * 0.12,
    height * 1.02,
    -half * 0.05,
    height * 1.06,
    0,
    height,
  );
  shape.bezierCurveTo(
    half * 0.05,
    height * 1.06,
    half * 0.12,
    height * 1.02,
    half * 0.26,
    height * 0.94,
  );
  shape.bezierCurveTo(
    half * 0.9,
    height * 0.68,
    half * 0.95,
    height * 0.22,
    half,
    0,
  );
  shape.lineTo(-half, 0);
  return shape;
}

export function createNeedleSpireCurve(side = 1, offset = 0) {
  return new THREE.CatmullRomCurve3(
    makeMirroredPoints(side, [
      [4.8 + offset, 6.2, 2.1],
      [5.8 + offset, 14.8, -1.6],
      [4.8 + offset, 25.4, -6.1],
      [2.5 + offset, 39.8, -10.2],
      [0.8 + offset, 57.2, -12.2],
    ]),
    false,
    "catmullrom",
    0.52,
  );
}

export function createMidRibCurve(side = 1, bend = 1) {
  return new THREE.CatmullRomCurve3(
    makeMirroredPoints(side, [
      [0.5, 0.3, 12.7],
      [1.05, 3.4, 11.0],
      [1.5, 8.8, 8.0],
      [1.3, 16.4, 3.6],
      [0.78, 26.4, -1.7 * bend],
      [0.16, 40.4, -6.2 * bend],
    ]),
    false,
    "catmullrom",
    0.56,
  );
}

export function createVeilWingCurve(side = 1) {
  return new THREE.CatmullRomCurve3(
    makeMirroredPoints(side, [
      [3.2, 3.4, 8.6],
      [5.6, 9.8, 4.4],
      [6.8, 18.2, -2.5],
      [5.4, 29.6, -10.3],
      [3.1, 42.8, -16.6],
    ]),
    false,
    "catmullrom",
    0.5,
  );
}
