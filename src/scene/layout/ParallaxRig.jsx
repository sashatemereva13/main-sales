import SceneParallaxRig from "../../summerscene/SceneParallaxRig";

export default function ParallaxRig({ children, disabled }) {
  return <SceneParallaxRig disabled={disabled}>{children}</SceneParallaxRig>;
}
