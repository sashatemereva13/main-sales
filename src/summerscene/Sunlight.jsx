export default function SunLight({
  shadows = true,
  shadowMapSize = 2048,
}) {
  return (
    <>
      <ambientLight intensity={0.44} color="#ffdfbc" />
      <hemisphereLight
        intensity={1.74}
        color="#ffc98f"
        groundColor="#7c6043"
      />
      <directionalLight
        position={[46, 28, 18]}
        intensity={1.4}
        color="#ffd3a2"
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

      {/* Cool rim fill gives the scene that crisp animated sky separation. */}
      <directionalLight
        position={[-42, 24, -50]}
        intensity={0.34}
        color="#ffc88f"
      />

      {/* Warm low fill keeps highlights soft and dreamy. */}
      <directionalLight
        position={[-18, 8, -30]}
        intensity={0.24}
        color="#ffb775"
      />
    </>
  );
}
