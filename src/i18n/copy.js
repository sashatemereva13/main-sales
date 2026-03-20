export const UI_COPY = {
  fr: {
    nav: {
      studioHud: "Studio HUD",
      meadowLive: "Meadow Live",
      tagline: "Des expériences digitales personnalisées",
      scene: "Scène",
      quiz: "Quiz",
      recommendation: "Recommandation",
      openChannels: "Canaux ouverts",
      localeFr: "FR",
      localeEn: "EN",
      localeLabel: "Langue",
      navTabsAria: "Onglets de navigation",
    },
    intro: {
      discoverySession: "Session de découverte",
      welcome: "Bienvenue",
      studio: "Studio",
      process: "Processus",
      studioEnvironment: "Environnement studio",
      available: "Disponible",
      subtitle: "Des sites strategiques qui convertissent",
      startQuiz: "Commencer le quiz",
      ctaMeta: "3 min • plan web personnalise",
      heroTabsAria: "Onglets d’accueil",
      scrollHint: "Scroll down",
      annotations: {
        presents: "Amber Composition Studio",
        format: "sites web",
        type: "premium",
        lineNote: "La philosophie de marque traduite en présence digitale",
      },
    },
    quiz: {
      validFormat: "Veuillez entrer un format valide.",
      submitErrorRetry:
        "Une erreur est survenue pendant l'envoi. Réessayez dans quelques instants.",
      submitErrorUnavailable:
        "Impossible d'envoyer votre recommandation pour le moment.",
      summaryLoadingKicker: "Préparation",
      summaryLoadingTitle: "J'assemble votre recommandation",
      summaryLoadingText:
        "Je relis vos réponses et je compose une proposition adaptée à votre projet.",
      summaryTitle: "Voici ce que je vous proposerais",
      summaryLead:
        "Merci {firstName}. Votre parcours dans le studio est terminé, voici une direction claire pour la suite.",
      summaryAria: "Résumé du parcours",
      answersCount: "{count} réponses",
      questionsCount: "{count} questions",
      themesCount: "{count} thèmes",
      tierEyebrow: "Recommandation",
      deliveryLabel: "Envoi de votre recommandation",
      deliveryNote:
        "Vous pourrez revenir en arrière pour ajuster une réponse avant l'envoi.",
      answersDetails: "Voir le détail de vos réponses",
      submitPending: "Envoi en cours... je prépare votre recommandation.",
      sendingButton: "Envoi en cours...",
      thankYou:
        "Merci. Votre recommandation personnalisée sera envoyée très bientôt à {recipient}.",
      editAnswers: "Modifier mes réponses",
      receiveRecommendation: "Recevoir cette recommandation",
      loadingRecipientFallback: "votre email",
      firstNameFallback: "vous",
      questionLabel: "Question",
      preparingPhase: "preparing",
    },
    quizStep: {
      emailPlaceholder: "votre@email.com",
      urlPlaceholder: "https://...",
      textPlaceholder: "Ce que vous ressentez...",
      enterToContinue: "Entrée pour continuer",
      continue: "continuer →",
      skip: "passer →",
    },
    progress: {
      step: "Étape",
      question: "Question",
      routeLabel: "Parcours stratégique",
    },
    quizNav: {
      back: "← retour",
      question: "Question",
    },
  },
  en: {
    nav: {
      studioHud: "Studio HUD",
      meadowLive: "Meadow Live",
      tagline: "Custom digital experiences",
      scene: "Scene",
      quiz: "Quiz",
      recommendation: "Recommendation",
      openChannels: "Open channels",
      localeFr: "FR",
      localeEn: "EN",
      localeLabel: "Language",
      navTabsAria: "Navigation tabs",
    },
    intro: {
      discoverySession: "Discovery Session",
      welcome: "Welcome",
      studio: "Studio",
      process: "Process",
      studioEnvironment: "Studio Environment",
      available: "Available",
      subtitle: "Websites that attract",
      startQuiz: "Start Quiz",
      ctaMeta: "3 min • personalized web plan",
      heroTabsAria: "Hero tabs",
      scrollHint: "Scroll down",
      annotations: {
        presents: "Amber Composition Studio",
        format: "Premium websites and immersive digital experiences ",
        type: "for brands, artists, and founders with a point of view",
        lineNote: "Brand philosophy, translated into digital presence",
      },
    },
    quiz: {
      validFormat: "Please enter a valid format.",
      submitErrorRetry:
        "An error occurred while sending. Please try again in a moment.",
      submitErrorUnavailable: "Your recommendation cannot be sent right now.",
      summaryLoadingKicker: "Preparing",
      summaryLoadingTitle: "I'm assembling your recommendation",
      summaryLoadingText:
        "I'm reviewing your answers and preparing a proposal tailored to your project.",
      summaryTitle: "Here is what I would recommend",
      summaryLead:
        "Thank you, {firstName}. Your studio journey is complete, and here is a clear direction for what comes next.",
      summaryAria: "Journey summary",
      answersCount: "{count} answers",
      questionsCount: "{count} questions",
      themesCount: "{count} themes",
      tierEyebrow: "Recommendation",
      deliveryLabel: "Send your recommendation to",
      deliveryNote: "You can go back and adjust an answer before sending.",
      answersDetails: "View your answers",
      submitPending: "Sending... preparing your recommendation.",
      sendingButton: "Sending...",
      thankYou:
        "Thank you. Your personalized recommendation will be sent very soon to {recipient}.",
      editAnswers: "Edit my answers",
      receiveRecommendation: "Receive this recommendation",
      loadingRecipientFallback: "your email",
      firstNameFallback: "you",
      questionLabel: "Question",
      preparingPhase: "preparing",
    },
    quizStep: {
      emailPlaceholder: "your@email.com",
      urlPlaceholder: "https://...",
      textPlaceholder: "What you're feeling...",
      enterToContinue: "Press Enter to continue",
      continue: "continue →",
      skip: "skip →",
    },
    progress: {
      step: "Step",
      question: "Question",
      routeLabel: "Strategy path",
    },
    quizNav: {
      back: "← back",
      question: "Question",
    },
  },
};

export function getCopy(locale = "fr") {
  return UI_COPY[locale] || UI_COPY.fr;
}

export function formatCopy(template, vars = {}) {
  return String(template).replace(/\{(.*?)\}/g, (_, key) =>
    vars[key] == null ? "" : String(vars[key]),
  );
}
