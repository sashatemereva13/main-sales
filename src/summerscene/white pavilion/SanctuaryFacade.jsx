import EntryPortalDoor from "./EntryPortalDoor";
import ToonOutlineMesh from "./ToonOutlineMesh";

function SideArch({
  position,
  rotation,
  scale,
  sideArchGeometry,
  trimMaterial,
  shadowMaterial,
  glassMaterial,
  outlineMaterial,
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh
        geometry={sideArchGeometry}
        material={trimMaterial}
        castShadow
        receiveShadow
      />
      <ToonOutlineMesh
        geometry={sideArchGeometry}
        outlineMaterial={outlineMaterial}
        thickness={1.03}
      />
      <mesh position={[0, 0.44, -0.2]} material={shadowMaterial}>
        <boxGeometry args={[2.6, 4.6, 0.54]} />
      </mesh>
      <mesh position={[0, 0.84, 0.02]} material={glassMaterial}>
        <planeGeometry args={[1.8, 5.2]} />
      </mesh>
    </group>
  );
}

export default function SanctuaryFacade({
  portalGlowRef,
  frontArchOuterGeometry,
  frontArchInnerGeometry,
  sideArchGeometry,
  doorFrameGeometry,
  doorLeafGeometry,
  trimMaterial,
  shellMaterial,
  accentMaterial,
  glassMaterial,
  portalCoreMaterial,
  glowMaterial,
  shadowMaterial,
  outlineMaterial,
  leftFrontRibGeometry,
  rightFrontRibGeometry,
  leftMidRibGeometry,
  rightMidRibGeometry,
  innerTraceryGeometry,
}) {
  return (
    <group position={[0, 0, 0.1]}>
      <mesh
        position={[0, 1.4, 7.4]}
        geometry={frontArchOuterGeometry}
        material={trimMaterial}
        castShadow
        receiveShadow
      />
      <ToonOutlineMesh
        position={[0, 1.4, 7.4]}
        geometry={frontArchOuterGeometry}
        outlineMaterial={outlineMaterial}
        thickness={1.028}
      />
      <mesh
        position={[0, 2.6, 6.8]}
        geometry={frontArchInnerGeometry}
        material={shellMaterial}
        castShadow
        receiveShadow
      />
      <ToonOutlineMesh
        position={[0, 2.6, 6.8]}
        geometry={frontArchInnerGeometry}
        outlineMaterial={outlineMaterial}
        thickness={1.026}
      />

      <mesh position={[0, 4.9, 6.22]} material={glassMaterial}>
        <planeGeometry args={[2.5, 8.8]} />
      </mesh>

      <mesh
        geometry={leftFrontRibGeometry}
        material={trimMaterial}
        castShadow
      />
      <ToonOutlineMesh
        geometry={leftFrontRibGeometry}
        outlineMaterial={outlineMaterial}
        thickness={1.04}
      />
      <mesh
        geometry={rightFrontRibGeometry}
        material={trimMaterial}
        castShadow
      />
      <ToonOutlineMesh
        geometry={rightFrontRibGeometry}
        outlineMaterial={outlineMaterial}
        thickness={1.04}
      />
      <mesh
        geometry={leftMidRibGeometry}
        material={trimMaterial}
        castShadow
      />
      <ToonOutlineMesh
        geometry={leftMidRibGeometry}
        outlineMaterial={outlineMaterial}
        thickness={1.05}
      />
      <mesh
        geometry={rightMidRibGeometry}
        material={trimMaterial}
        castShadow
      />
      <ToonOutlineMesh
        geometry={rightMidRibGeometry}
        outlineMaterial={outlineMaterial}
        thickness={1.05}
      />

      <mesh
        position={[0, 4.2, 7.24]}
        geometry={innerTraceryGeometry}
        material={trimMaterial}
        castShadow
      />
      <ToonOutlineMesh
        position={[0, 4.2, 7.24]}
        geometry={innerTraceryGeometry}
        outlineMaterial={outlineMaterial}
        thickness={1.03}
      />
      <mesh
        position={[0, 6.6, 6.92]}
        scale={[0.76, 0.82, 1]}
        geometry={innerTraceryGeometry}
        material={accentMaterial}
      />
      <mesh
        position={[0, 8.7, 6.58]}
        scale={[0.58, 0.67, 1]}
        geometry={innerTraceryGeometry}
        material={glassMaterial}
      />

      <mesh
        position={[0, 2.8, 11.7]}
        rotation={[0, 0, Math.PI]}
        material={accentMaterial}
      >
        <coneGeometry args={[1.1, 5.6, 6]} />
      </mesh>

      <SideArch
        position={[-7.2, 2.2, 3.6]}
        rotation={[0.02, 0.36, -0.08]}
        scale={[0.92, 1.06, 1]}
        sideArchGeometry={sideArchGeometry}
        trimMaterial={trimMaterial}
        shadowMaterial={shadowMaterial}
        glassMaterial={glassMaterial}
        outlineMaterial={outlineMaterial}
      />
      <SideArch
        position={[7.2, 2.2, 3.2]}
        rotation={[-0.02, -0.36, 0.08]}
        scale={[0.92, 1.06, 1]}
        sideArchGeometry={sideArchGeometry}
        trimMaterial={trimMaterial}
        shadowMaterial={shadowMaterial}
        glassMaterial={glassMaterial}
        outlineMaterial={outlineMaterial}
      />

      <EntryPortalDoor
        portalGlowRef={portalGlowRef}
        doorFrameGeometry={doorFrameGeometry}
        doorLeafGeometry={doorLeafGeometry}
        trimMaterial={trimMaterial}
        accentMaterial={accentMaterial}
        glassMaterial={glassMaterial}
        portalCoreMaterial={portalCoreMaterial}
        glowMaterial={glowMaterial}
        outlineMaterial={outlineMaterial}
      />
    </group>
  );
}
