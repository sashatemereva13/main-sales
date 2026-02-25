const SUMMARY_COPY = {
  fr: {
    goalMap: {
      showcase: "présenter son travail",
      clients: "attirer de nouveaux clients",
      sell: "vendre un service ou un produit",
      branding: "renforcer son image de marque",
    },
    audienceMap: {
      audience_clients: "des clients potentiels",
      audience_recruiters: "des recruteurs ou employeurs",
      audience_partners: "des partenaires",
      audience_public: "le grand public",
    },
    vibeMap: {
      vibe_minimal: "minimaliste et épurée",
      vibe_creative: "créative et artistique",
      vibe_premium: "premium et élégante",
      vibe_warm: "chaleureuse et humaine",
      vibe_immersive: "immersive et audacieuse",
    },
    fallbackGoal: "clarifier sa présence en ligne",
    fallbackAudience: "son audience cible",
    fallbackVibe: "personnelle",
    discoverIntent: "d’inviter les visiteurs à découvrir un univers",
    actionIntent: "de guider les visiteurs vers une action claire",
    paragraph1:
      "Ce client souhaite {goal} à travers un site destiné principalement à {audience}.",
    paragraph2:
      "Le projet s’inscrit dans une approche {vibe}, avec une volonté {intent}.",
    paragraph3:
      "Au vu des réponses, une expérience de type **{tier}** est recommandée, afin de traduire fidèlement l’identité du projet tout en laissant de la place à son évolution.",
  },
  en: {
    goalMap: {
      showcase: "showcase their work",
      clients: "attract new clients",
      sell: "sell a service or product",
      branding: "strengthen their brand image",
    },
    audienceMap: {
      audience_clients: "potential clients",
      audience_recruiters: "recruiters or employers",
      audience_partners: "partners",
      audience_public: "a general audience",
    },
    vibeMap: {
      vibe_minimal: "minimal and clean",
      vibe_creative: "creative and artistic",
      vibe_premium: "premium and elegant",
      vibe_warm: "warm and human",
      vibe_immersive: "immersive and bold",
    },
    fallbackGoal: "clarify their online presence",
    fallbackAudience: "their target audience",
    fallbackVibe: "personal",
    discoverIntent: "to invite visitors to explore a world",
    actionIntent: "to guide visitors toward a clear action",
    paragraph1:
      "This client wants to {goal} through a website designed primarily for {audience}.",
    paragraph2:
      "The project follows a {vibe} direction, with the intention {intent}.",
    paragraph3:
      "Based on the answers, an experience of type **{tier}** is recommended to express the project’s identity faithfully while leaving room for future growth.",
  },
};

function format(template, vars) {
  return template.replace(/\{(.*?)\}/g, (_, key) => vars[key] ?? "");
}

export function generateClientSummary(answers, tier, locale = "fr") {
  const copy = SUMMARY_COPY[locale] || SUMMARY_COPY.fr;
  const goal = copy.goalMap[answers.objective] || copy.fallbackGoal;
  const audience = copy.audienceMap[answers.audience] || copy.fallbackAudience;
  const vibe = copy.vibeMap[answers.vibe] || copy.fallbackVibe;
  const intent =
    answers.action === "action_discover" ? copy.discoverIntent : copy.actionIntent;

  return [
    format(copy.paragraph1, { goal, audience }),
    format(copy.paragraph2, { vibe, intent }),
    format(copy.paragraph3, { tier }),
  ].join("\n\n");
}
