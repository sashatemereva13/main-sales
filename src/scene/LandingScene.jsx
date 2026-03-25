import SceneCanvas from "./core/SceneCanvas";
import SkyDome from "./environment/SkyDome";
import Lighting from "./environment/Lighting";
import ParallaxRig from "./layout/ParallaxRig";
import GrassField from "./grass/GrassField";
import TreesFeature from "./trees/TreesFeature";
import RabbitsFeature from "./wildlife/RabbitsFeature";
import { PavilionFeature } from "./pavilion";
import Ground from "../summerscene/Ground";
import MeadowRoad from "../summerscene/MeadowRoad";
import CameraController from "../questioneer/CameraController";
import HeroTitle from "../hero/HeroTitle";

export default function LandingScene({
  resetToken,
  visible,
  profile,
  isConfiguratorActive,
  cameraTarget,
  cameraLookAt,
  cameraIntroDone,
  introCameraStart,
  introCameraDuration,
  introLookAtStart,
  introLookAtEnd,
  introOrbitTurns,
  introOrbitStart,
  introOrbitUntil,
  onIntroComplete,
  onContextLost,
  onContextRestored,
}) {
  const wildlifePaused = isConfiguratorActive || profile.flags.lowPower;

  return (
    <SceneCanvas
      profile={profile}
      visible={visible}
      resetToken={resetToken}
      camera={{ position: introCameraStart, fov: 45 }}
      onContextLost={onContextLost}
      onContextRestored={onContextRestored}
    >
      <fog attach="fog" args={["#efb48d", 165, 560]} />
      <CameraController
        target={cameraTarget}
        introStart={introCameraStart}
        introDuration={introCameraDuration}
        introLookAtStart={introLookAtStart}
        introOrbitTurns={introOrbitTurns}
        introOrbitStart={introOrbitStart}
        introOrbitUntil={introOrbitUntil}
        skipIntro={cameraIntroDone}
        lookAt={cameraLookAt}
        onIntroComplete={onIntroComplete}
      />
      <SkyDome />
      <Lighting profile={profile} />
      {/* <HeroTitle /> */}
      <ParallaxRig
        disabled={profile.capabilities.isMobile || isConfiguratorActive}
      >
        {/* <PavilionFeature preserveGlass={profile.pavilion.preserveGlass} /> */}
        <Ground />
        <TreesFeature profile={profile} />
        <GrassField profile={profile} paused={isConfiguratorActive} />
        {/* <MeadowRoad /> */}
        {/* <RabbitsFeature profile={profile} paused={wildlifePaused} /> */}
      </ParallaxRig>
    </SceneCanvas>
  );
}
