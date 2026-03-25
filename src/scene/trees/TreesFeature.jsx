import Trees from "../../summerscene/Trees";

export default function TreesFeature({ profile }) {
  return <Trees count={profile.trees.count} />;
}
