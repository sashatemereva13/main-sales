import SunLight from "../../summerscene/Sunlight";

export default function Lighting({ profile }) {
  return (
    <SunLight
      shadows={profile.shadows}
      shadowMapSize={profile.shadowMapSize}
    />
  );
}
