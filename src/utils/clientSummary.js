
export function generateClientSummary(answers, tier) {
  const goalMap = {
    showcase: "présenter son travail",
    clients: "attirer de nouveaux clients",
    sell: "vendre un service ou un produit",
    branding: "renforcer son image de marque",
  };

  const vibeMap = {
    vibe_minimal: "minimaliste et épurée",
    vibe_creative: "créative et artistique",
    vibe_premium: "premium et élégante",
    vibe_warm: "chaleureuse et humaine",
    vibe_immersive: "immersive et audacieuse",
  };

  return `
Ce client souhaite ${goalMap[answers.objective] || "clarifier sa présence en ligne"} 
à travers un site destiné principalement à ${
    answers.audience || "son audience cible"
  }.

Le projet s’inscrit dans une approche ${
    vibeMap[answers.vibe] || "personnelle"
  }, avec une volonté ${
    answers.action_discover
      ? "d’inviter les visiteurs à découvrir un univers"
      : "de guider les visiteurs vers une action claire"
  }.

Au vu des réponses, une expérience de type **${tier}** est recommandée, afin de traduire
fidèlement l’identité du projet tout en laissant de la place à son évolution.
`.trim();
}
