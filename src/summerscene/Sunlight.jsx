export default function SunLight() {
  return (
    <>
      <ambientLight intensity={0.42} color="#ffe8d4" />
      <hemisphereLight
        intensity={2.55}
        color="#ffd7cc"
        groundColor="#88b36d"
      />
      <directionalLight
        position={[34, 12, 18]}
        intensity={1.02}
        color="#ffd1ad"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
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
        position={[-24, 7, -42]}
        intensity={0.22}
        color="#ffc8bc"
      />
    </>
  );
}
