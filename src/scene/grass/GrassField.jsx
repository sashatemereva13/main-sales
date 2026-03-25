import OriginalGrassField from "../../summerscene/GrassField";

function mapQuality(quality) {
  if (quality === "low") return "low";
  if (quality === "medium") return "mid";
  return "high";
}

export default function GrassField({ profile, paused = false }) {
  return (
    <OriginalGrassField
      count={profile.grass.count}
      quality={mapQuality(profile.quality)}
      paused={paused}
      hoverEnabled={!profile.capabilities.isMobile}
      crossLayers
      conservative={false}
    />
  );
}
