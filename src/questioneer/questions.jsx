const steps = [
  // =========================
  // WHY / INTENT
  // =========================
  {
    question: "Quel est l’objectif principal de votre site web ?",
    options: [
      {
        label: "Présenter mon travail",
        caption: "Portfolio, projets, CV ou réalisations",
        value: "showcase",
        scene: "1",
      },
      {
        label: "Trouver des clients",
        caption: "Générer des contacts et des opportunités",
        value: "clients",
        scene: "2",
      },
      {
        label: "Vendre un service ou un produit",
        caption: "Offres, paiements, conversion",
        value: "sell",
        scene: "3",
      },
      {
        label: "Renforcer mon image / univers",
        caption: "Positionnement, identité, crédibilité",
        value: "branding",
        scene: "4",
      },
      {
        label: "Je ne sais pas encore",
        caption: "J’ai besoin d’être guidé·e",
        value: "unsure",
        scene: "5",
      },
    ],
  },

  // =========================
  // AUDIENCE
  // =========================
  {
    question: "À qui s’adresse principalement ce site ?",
    options: [
      {
        label: "Clients potentiels",
        caption: "Personnes intéressées par vos services",
        value: "audience_clients",
        scene: "6",
      },
      {
        label: "Recruteurs / employeurs",
        caption: "Entreprises, studios, équipes",
        value: "audience_recruiters",
        scene: "7",
      },
      {
        label: "Partenaires",
        caption: "Collaborations et projets communs",
        value: "audience_partners",
        scene: "8",
      },
      {
        label: "Grand public",
        caption: "Audience large et non spécialisée",
        value: "audience_public",
        scene: "9",
      },
    ],
  },

  {
    question: "Que souhaitez-vous que les visiteurs fassent en priorité ?",
    options: [
      {
        label: "Me contacter",
        caption: "Message, email ou prise de contact simple",
        value: "action_contact",
        scene: "10",
      },
      {
        label: "Réserver / demander un devis",
        caption: "Formulaire, appel ou réservation",
        value: "action_booking",
        scene: "11",
      },
      {
        label: "Acheter",
        caption: "Produit ou service en ligne",
        value: "action_buy",
        scene: "12",
      },
      {
        label: "Découvrir mon univers",
        caption: "Explorer votre travail et votre vision",
        value: "action_discover",
        scene: "13",
      },
    ],
  },

  // =========================
  // ACTIVITY & VALUES
  // =========================
  {
    question: "Comment décririez-vous votre activité ?",
    type: "text",
    key: "activity",
    scene: "14",
  },

  {
    question: "Qu’est-ce qui vous différencie des autres dans votre domaine ?",
    type: "text",
    key: "differentiation",
    scene: "15",
  },

  {
    question: "Quelle atmosphère souhaitez-vous transmettre ?",
    options: [
      {
        label: "Minimaliste & épuré",
        caption: "Clair, sobre, essentiel",
        value: "vibe_minimal",
        scene: "16",
      },
      {
        label: "Créatif & artistique",
        caption: "Expressif, visuel, expérimental",
        value: "vibe_creative",
        scene: "17",
      },
      {
        label: "Premium & élégant",
        caption: "Haut de gamme, raffiné, soigné",
        value: "vibe_premium",
        scene: "18",
      },
      {
        label: "Chaleureux & humain",
        caption: "Accessible, sincère, proche",
        value: "vibe_warm",
        scene: "19",
      },
      {
        label: "Audacieux & immersif",
        caption: "Impactant, expérientiel, marquant",
        value: "vibe_immersive",
        scene: "20",
      },
    ],
  },

  // =========================
  // DESIGN & IMMERSION
  // =========================
  {
    question: "Avez-vous déjà une idée du style visuel ?",
    options: [
      {
        label: "Oui, assez précise",
        caption: "Références claires, vision définie",
        value: "design_clear",
        scene: "21",
      },
      {
        label: "Quelques idées seulement",
        caption: "Inspiration partielle, à affiner",
        value: "design_partial",
        scene: "22",
      },
      {
        label: "Non, j’ai besoin d’accompagnement",
        caption: "Direction artistique à construire",
        value: "design_help",
        scene: "23",
      },
    ],
  },

  {
    question: "Souhaitez-vous un site plutôt classique ou original ?",
    options: [
      {
        label: "Classique & efficace",
        caption: "Lisible, structuré, rassurant",
        value: "classic",
        scene: "24",
      },
      {
        label: "Original & immersif",
        caption: "Expérience marquante et différenciante",
        value: "immersive",
        scene: "25",
      },
      {
        label: "Un équilibre entre les deux",
        caption: "Créatif mais accessible",
        value: "balanced",
        scene: "26",
      },
    ],
  },

  // =========================
  // CONTENT
  // =========================
  {
    question: "Avez-vous déjà les contenus nécessaires ?",
    options: [
      {
        label: "Oui, tout est prêt",
        caption: "Textes, images, identité existante",
        value: "content_ready",
        scene: "27",
      },
      {
        label: "Partiellement",
        caption: "Une base existe, à compléter",
        value: "content_partial",
        scene: "28",
      },
      {
        label: "Non, j’aurai besoin d’aide",
        caption: "Rédaction et structuration à prévoir",
        value: "content_missing",
        scene: "29",
      },
    ],
  },

  // =========================
  // FEATURES
  // =========================
  {
    question: "Quelles fonctionnalités sont importantes pour vous ?",
    options: [
      {
        label: "Formulaire / contact / réservation",
        caption: "Interaction simple avec les visiteurs",
        value: "feature_form",
        scene: "30",
      },
      {
        label: "Animations & interactions",
        caption: "Dynamisme et engagement visuel",
        value: "feature_animations",
        scene: "31",
      },
      {
        label: "3D / expérience immersive",
        caption: "Univers interactif et différenciant",
        value: "feature_3d",
        scene: "32",
      },
      {
        label: "Quelque chose de simple",
        caption: "Essentiel, rapide, sans superflu",
        value: "feature_simple",
        scene: "33",
      },
    ],
  },

  {
    question:
      "Souhaitez-vous pouvoir modifier le contenu vous-même plus tard ?",
    options: [
      {
        label: "Oui",
        caption: "Autonomie pour mises à jour futures",
        value: "cms_yes",
        scene: "34",
      },
      {
        label: "Non / peu",
        caption: "Gestion ponctuelle ou accompagnée",
        value: "cms_no",
        scene: "35",
      },
    ],
  },

  // =========================
  // VISION & COMMITMENT
  // =========================
  {
    question: "Comment imaginez-vous l’évolution du site dans le temps ?",
    options: [
      {
        label: "Projet ponctuel",
        caption: "Besoin précis et limité",
        value: "one_time",
        scene: "36",
      },
      {
        label: "Évolutif progressivement",
        caption: "Améliorations et ajouts réguliers",
        value: "evolving",
        scene: "37",
      },
      {
        label: "Base d’un projet plus large",
        caption: "Vision long terme et scalable",
        value: "long_term",
        scene: "38",
      },
    ],
  },

  // =========================
  // CONTACT
  // =========================
  {
    question: "Quel est votre nom ?",
    type: "text",
    key: "name",
    scene: "39",
  },
  {
    question: "Un lien vers votre site ou Instagram (si vous en avez un)",
    type: "text",
    key: "link",
    scene: "40",
  },
  {
    question:
      "Indiquez votre email pour recevoir votre recommandation personnalisée ✨",
    type: "text",
    key: "email",
    scene: "41",
  },
];

export default steps;
