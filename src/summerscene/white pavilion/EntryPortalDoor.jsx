import { Text } from "@react-three/drei";
import { WHITE_PAVILION_SCREEN_GROUP_POSITION } from "./constants";
import ToonOutlineMesh from "./ToonOutlineMesh";

export default function EntryPortalDoor({
  portalGlowRef,
  doorLeafGeometry,
  doorFrameGeometry,
  trimMaterial,
  accentMaterial,
  glassMaterial,
  portalCoreMaterial,
  glowMaterial,
  outlineMaterial,
}) {
  return (
    <group position={WHITE_PAVILION_SCREEN_GROUP_POSITION}>
      <mesh
        geometry={doorFrameGeometry}
        material={trimMaterial}
        castShadow
        receiveShadow
      />
      <ToonOutlineMesh
        geometry={doorFrameGeometry}
        outlineMaterial={outlineMaterial}
        thickness={1.035}
      />
      <mesh
        position={[0, 0.34, 0.12]}
        geometry={doorLeafGeometry}
        material={glassMaterial}
        castShadow
        receiveShadow
      />
      <ToonOutlineMesh
        position={[0, 0.34, 0.12]}
        geometry={doorLeafGeometry}
        outlineMaterial={outlineMaterial}
        thickness={1.04}
      />
      <mesh
        position={[0, 0.36, 0.18]}
        geometry={doorLeafGeometry}
        material={portalCoreMaterial}
        renderOrder={2}
      />
      <mesh position={[0, 0.06, 0.22]} material={accentMaterial}>
        <boxGeometry args={[1.96, 0.1, 0.24]} />
      </mesh>
      <mesh ref={portalGlowRef} position={[0, 4.24, 0.26]} material={glowMaterial}>
        <torusGeometry args={[0.82, 0.04, 20, 120]} />
      </mesh>
      <mesh position={[-0.64, 2.12, 0.22]} material={glowMaterial}>
        <boxGeometry args={[0.036, 2.84, 0.05]} />
      </mesh>
      <mesh position={[0.64, 2.12, 0.22]} material={glowMaterial}>
        <boxGeometry args={[0.036, 2.84, 0.05]} />
      </mesh>
      <Text
        font="/fonts/Canobis.ttf"
        position={[0, 2.46, 0.28]}
        fontSize={0.34}
        maxWidth={1}
        letterSpacing={0.12}
        color="#1d3e66"
        anchorX="center"
        anchorY="middle"
        renderOrder={3}
      >
        Enter
      </Text>
    </group>
  );
}
