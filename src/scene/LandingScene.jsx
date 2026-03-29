import SceneCanvas from "./core/SceneCanvas";
import SkyDome from "./environment/SkyDome";
import Lighting from "./environment/Lighting";
import { PavilionFeature } from "./pavilion";
import CloudSea from "../summerscene/CloudSea";
import Ground from "../summerscene/Ground";
import GrassField from "./grass/GrassField";
import Trees from "../summerscene/Trees";
import CameraController from "../questioneer/CameraController";

export default function LandingScene({
  resetToken,
  visible,
  profile,
  cameraTarget,
  cameraLookAt,
  cameraIntroDone,
  introCameraStart,
  introCameraDuration,
  introLookAtStart,
  introOrbitTurns,
  introOrbitStart,
  introOrbitUntil,
  onIntroComplete,
  onContextLost,
  onContextRestored,
}) {
  return (
    <SceneCanvas
      profile={profile}
      visible={visible}
      resetToken={resetToken}
      camera={{ position: introCameraStart, fov: 45 }}
      onContextLost={onContextLost}
      onContextRestored={onContextRestored}
    >
      <fog attach="fog" args={["#f3be86", 130, 620]} />
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
      <CloudSea />
      <Ground />
      <GrassField profile={profile} paused={false} />
      <Trees count={3} />
      <PavilionFeature preserveGlass={profile.pavilion.preserveGlass} />
    </SceneCanvas>
  );
}
