import Rabbit from "../../summerscene/Rabbit";

const RABBIT_POSITIONS = [
  [0, 0.5, 12],
  [-2, 0.35, -10],
  [2, 0.8, -28],
];

export default function RabbitsFeature({ profile, paused }) {
  if (profile.wildlife.rabbitSlots <= 0) return null;

  return RABBIT_POSITIONS.slice(0, profile.wildlife.rabbitSlots).map(
    (position, index) => (
      <Rabbit
        key={`rabbit-${index}`}
        position={position}
        paused={paused || profile.wildlife.paused}
      />
    ),
  );
}
