const steps = [
  {
    question: "What is your name?",
    type: "text",
    key: "name",
    maxLength: 40,
    required: true,
    inputType: "text",
    scene: "39",
  },
  {
    question: "{name}, what is the main goal of your website?",
    key: "objective",
    options: [
      {
        label: "Show my work",
        caption: "Portfolio, projects, CV, or case studies",
        value: "showcase",
        scene: "1",
      },
      {
        label: "Find clients",
        caption: "Generate leads and opportunities",
        value: "clients",
        scene: "2",
      },
      {
        label: "Sell a service or product",
        caption: "Offers, payments, conversion",
        value: "sell",
        scene: "3",
      },
      {
        label: "Strengthen my brand/image",
        caption: "Positioning, identity, credibility",
        value: "branding",
        scene: "4",
      },
      {
        label: "I'm not sure yet",
        caption: "I need guidance",
        value: "unsure",
        scene: "5",
      },
    ],
  },
  {
    question: "{name}, who is this website mainly for?",
    key: "audience",
    options: [
      {
        label: "Potential clients",
        caption: "People interested in your services",
        value: "audience_clients",
        scene: "6",
      },
      {
        label: "Recruiters / employers",
        caption: "Companies, studios, teams",
        value: "audience_recruiters",
        scene: "7",
      },
      {
        label: "Partners",
        caption: "Collaborations and shared projects",
        value: "audience_partners",
        scene: "8",
      },
      {
        label: "General public",
        caption: "Broad, non-specialized audience",
        value: "audience_public",
        scene: "9",
      },
    ],
  },
  {
    question: "{name}, what do you want visitors to do first?",
    key: "action",
    options: [
      {
        label: "Contact me",
        caption: "Message, email, or simple contact request",
        value: "action_contact",
        scene: "10",
      },
      {
        label: "Book / request a quote",
        caption: "Form, call, or booking flow",
        value: "action_booking",
        scene: "11",
      },
      {
        label: "Buy",
        caption: "Purchase a product or service online",
        value: "action_buy",
        scene: "12",
      },
      {
        label: "Explore my world",
        caption: "Discover your work and vision",
        value: "action_discover",
        scene: "13",
      },
    ],
  },
  {
    question: "{name}, how would you describe your activity/business?",
    type: "text",
    key: "activity",
    maxLength: 120,
    required: true,
    inputType: "text",
    scene: "14",
  },
  {
    question:
      "{name}, what makes you different from others in your field?",
    type: "text",
    key: "differentiation",
    maxLength: 160,
    required: true,
    inputType: "text",
    scene: "15",
  },
  {
    question: "{name}, what atmosphere do you want to communicate?",
    key: "vibe",
    options: [
      {
        label: "Minimal & clean",
        caption: "Clear, simple, essential",
        value: "vibe_minimal",
        scene: "16",
      },
      {
        label: "Creative & artistic",
        caption: "Expressive, visual, experimental",
        value: "vibe_creative",
        scene: "17",
      },
      {
        label: "Premium & elegant",
        caption: "High-end, refined, polished",
        value: "vibe_premium",
        scene: "18",
      },
      {
        label: "Warm & human",
        caption: "Approachable, sincere, close",
        value: "vibe_warm",
        scene: "19",
      },
      {
        label: "Bold & immersive",
        caption: "Impactful, experiential, memorable",
        value: "vibe_immersive",
        scene: "20",
      },
    ],
  },
  {
    question: "{name}, do you already have a visual style direction in mind?",
    key: "design",
    options: [
      {
        label: "Yes, fairly clear",
        caption: "Clear references, defined vision",
        value: "design_clear",
        scene: "21",
      },
      {
        label: "A few ideas only",
        caption: "Partial inspiration, needs refinement",
        value: "design_partial",
        scene: "22",
      },
      {
        label: "No, I need guidance",
        caption: "Art direction to be built",
        value: "design_help",
        scene: "23",
      },
    ],
  },
  {
    question: "{name}, do you want a more classic or original website?",
    key: "style",
    options: [
      {
        label: "Classic & effective",
        caption: "Readable, structured, reassuring",
        value: "classic",
        scene: "24",
      },
      {
        label: "Original & immersive",
        caption: "Memorable and differentiated experience",
        value: "immersive",
        scene: "25",
      },
      {
        label: "A balance of both",
        caption: "Creative but accessible",
        value: "balanced",
        scene: "26",
      },
    ],
  },
  {
    question: "{name}, do you already have the required content?",
    key: "content",
    options: [
      {
        label: "Yes, everything is ready",
        caption: "Copy, visuals, identity already available",
        value: "content_ready",
        scene: "27",
      },
      {
        label: "Partially",
        caption: "A base exists, needs completion",
        value: "content_partial",
        scene: "28",
      },
      {
        label: "No, I’ll need help",
        caption: "Content writing and structure to plan",
        value: "content_missing",
        scene: "29",
      },
    ],
  },
  {
    question: "{name}, which features are important to you?",
    key: "features",
    options: [
      {
        label: "Form / contact / booking",
        caption: "Simple interaction with visitors",
        value: "feature_form",
        scene: "30",
      },
      {
        label: "Animations & interactions",
        caption: "Dynamic feel and visual engagement",
        value: "feature_animations",
        scene: "31",
      },
      {
        label: "3D / immersive experience",
        caption: "Interactive and differentiated world",
        value: "feature_3d",
        scene: "32",
      },
      {
        label: "Something simple",
        caption: "Essential, fast, no extra complexity",
        value: "feature_simple",
        scene: "33",
      },
    ],
  },
  {
    question: "{name}, would you like to edit content yourself later on?",
    key: "cms",
    options: [
      {
        label: "Yes",
        caption: "Autonomy for future updates",
        value: "cms_yes",
        scene: "34",
      },
      {
        label: "No / not much",
        caption: "Occasional or assisted management",
        value: "cms_no",
        scene: "35",
      },
    ],
  },
  {
    question: "{name}, how do you imagine this website evolving over time?",
    key: "vision",
    options: [
      {
        label: "One-time project",
        caption: "Specific and limited need",
        value: "one_time",
        scene: "36",
      },
      {
        label: "Gradually evolving",
        caption: "Regular improvements and additions",
        value: "evolving",
        scene: "37",
      },
      {
        label: "Foundation of a bigger project",
        caption: "Long-term, scalable vision",
        value: "long_term",
        scene: "38",
      },
    ],
  },
  {
    question: "A link to your website or Instagram (if you have one)",
    type: "text",
    key: "link",
    maxLength: 120,
    required: false,
    inputType: "url",
    scene: "40",
  },
  {
    question:
      "Enter your email to receive your personalized recommendation ✨",
    type: "text",
    key: "email",
    maxLength: 80,
    required: true,
    inputType: "email",
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    scene: "41",
  },
];

export default steps;
