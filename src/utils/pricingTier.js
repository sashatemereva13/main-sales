export function calculateTier(answers) {
  let score = 0;

  const map = {
    showcase: 0,
    clients: 1,
    sell: 1,
    branding: 2,
    unsure: 1,

    audience_clients: 1,
    audience_recruiters: 0,
    audience_partners: 1,
    audience_public: 2,

    action_contact: 0,
    action_booking: 1,
    action_buy: 1,
    action_discover: 2,

    vibe_minimal: 0,
    vibe_warm: 0,
    vibe_creative: 1,
    vibe_premium: 1,
    vibe_immersive: 2,

    design_clear: 0,
    design_partial: 1,
    design_help: 2,

    classic: 0,
    balanced: 1,
    immersive: 2,

    content_ready: 0,
    content_partial: 1,
    content_missing: 2,

    feature_animations: 1,
    feature_3d: 2,
    feature_simple: 0,

    cms_yes: 1,
    cms_no: 0,
  };

  Object.values(answers).forEach((value) => {
    if (Object.hasOwn(map, value)) score += map[value];
  });

  // hard signals
  if (answers.features === "feature_3d") return "IMMERSIVE";

  if (score <= 4) return "ESSENCE";
  if (score <= 8) return "SIGNATURE";
  return "IMMERSIVE";
}
