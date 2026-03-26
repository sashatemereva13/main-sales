import OriginalGrassField from "../../summerscene/GrassField";

function mapQuality(quality) {
  if (quality === "low") return "low";
  if (quality === "medium") return "mid";
  return "high";
}

export default function GrassField({ profile, paused = false }) {
  return (
    <OriginalGrassField
      count={Math.floor(profile.grass.count * 1.4)}
      quality={mapQuality(profile.quality)}
      paused={paused}
      hoverEnabled={!profile.capabilities.isMobile}
      crossLayers
      conservative={false}
    />
  );
}
