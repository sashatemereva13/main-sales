export default function SunLight({
  shadows = true,
  shadowMapSize = 2048,
}) {
  return (
    <>
      <ambientLight intensity={0.34} color="#ffe3c1" />
      <hemisphereLight
        intensity={2.05}
        color="#ffd8bf"
        groundColor="#63744d"
      />
      <directionalLight
        position={[30, 11, 14]}
        intensity={1.04}
        color="#ffc08c"
        castShadow={shadows}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-left={-72}
        shadow-camera-right={72}
        shadow-camera-top={72}
        shadow-camera-bottom={-72}
        shadow-camera-near={1}
        shadow-camera-far={150}
        shadow-bias={-0.00012}
        shadow-normalBias={0.02}
      />

      {/* Warm low fill to soften contrast and unify the peach/rose grade. */}
      <directionalLight
        position={[-26, 9, -40]}
        intensity={0.2}
        color="#ffc6a4"
      />
    </>
  );
}
