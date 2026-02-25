import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./quiz.css";

import steps from "./questions";
import stepSections from "./steps";

import { calculateTier } from "../utils/pricingTier";
import { generateClientSummary } from "../utils/clientSummary";

import QuizProgress from "./QuizProgress";
import QuizStep from "./QuizStep";
import QuizNavigation from "./QuizNavigation";

// -------------------------
// Helpers
// -------------------------
function getCurrentSection(stepIndex) {
  return stepSections.find(
    (section) => stepIndex >= section.from && stepIndex <= section.to,
  );
}

function interpolate(text, answers) {
  if (!text) return "";

  return text.replace(/\{(.*?)\}/g, (_, key) => {
    return answers[key] || "";
  });
}

function getCameraWaypoint(stepIndex, totalSteps, initialCameraTarget) {
  if (stepIndex <= 0) return initialCameraTarget;

  const maxIndex = Math.max(totalSteps - 1, 1);
  const progress = Math.min(stepIndex / maxIndex, 1);

  // A calm, sweeping route across the meadow: gentle lateral movement + forward drift.
  const x = -18 + progress * 36 + Math.sin(progress * Math.PI * 2.3) * 4.5;
  const y =
    5.25 +
    Math.sin(progress * Math.PI * 1.2) * 0.5 +
    Math.cos(progress * Math.PI * 3.0) * 0.12;
  const z = 28 - progress * 44 + Math.cos(progress * Math.PI * 2.1) * 3.5;

  return [x, y, z];
}

// -------------------------
// Main Quiz
// -------------------------
export default function Quiz({
  setCameraTarget,
  initialCameraTarget = [0, 2.6, 26],
}) {
  const [answers, setAnswers] = useState({});
  const [stepIndex, setStepIndex] = useState(0);
  const [textInput, setTextInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [textError, setTextError] = useState("");
  const [resultPhase, setResultPhase] = useState("idle");

  const step = steps[stepIndex];
  const currentSection = getCurrentSection(stepIndex);
  const totalQuestionCount = steps.length;
  const currentQuestionNumber = Math.min(stepIndex + 1, totalQuestionCount);

  const currentStepNumber =
    stepSections.findIndex((s) => s === currentSection) + 1;
  const totalSteps = stepSections.length;

  // -------------------------
  // Skip steps with dependencies
  // -------------------------
  useEffect(() => {
    if (!step) return;

    if (step.dependsOn && !Object.values(answers).includes(step.dependsOn)) {
      setStepIndex((i) => i + 1);
    }
  }, [stepIndex, step, answers]);

  useEffect(() => {
    if (!step || step.type !== "text") {
      setTextInput("");
      setTextError("");
      return;
    }

    const key = step.key ?? stepIndex;
    setTextInput(typeof answers[key] === "string" ? answers[key] : "");
    setTextError("");
  }, [step, stepIndex, answers]);

  useEffect(() => {
    if (stepIndex < steps.length) {
      setResultPhase("idle");
      return;
    }

    setResultPhase("preparing");
    const timer = window.setTimeout(() => {
      setResultPhase("ready");
    }, 950);

    return () => window.clearTimeout(timer);
  }, [stepIndex]);

  // -------------------------
  // Navigation
  // -------------------------
  const goBack = () => {
    setStepIndex((prev) => {
      const nextIndex = Math.max(0, prev - 1);
      setCameraTarget(
        getCameraWaypoint(nextIndex, steps.length, initialCameraTarget),
      );
      return nextIndex;
    });
  };

  // -------------------------
  // Step handlers
  // -------------------------
  const handleSelect = (value) => {
    setSubmitError("");
    const key = step.key ?? stepIndex;

    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));

    setStepIndex((prev) => {
      const nextIndex = prev + 1;
      setCameraTarget(
        getCameraWaypoint(nextIndex, steps.length, initialCameraTarget),
      );
      return nextIndex;
    });
  };

  const handleTextSubmit = () => {
    const trimmedValue = textInput.trim();
    const isOptional = step.required === false;

    if (!trimmedValue && !isOptional) return;

    if (!trimmedValue && isOptional) {
      setTextError("");
      setSubmitError("");
      setStepIndex((prev) => {
        const nextIndex = prev + 1;
        setCameraTarget(
          getCameraWaypoint(nextIndex, steps.length, initialCameraTarget),
        );
        return nextIndex;
      });
      return;
    }

    if (step.pattern && !step.pattern.test(trimmedValue)) {
      setTextError("Veuillez entrer un format valide.");
      return;
    }

    const key = step.key ?? stepIndex;
    setTextError("");
    setSubmitError("");

    setAnswers((prev) => ({
      ...prev,
      [key]: trimmedValue,
    }));

    setTextInput("");

    setStepIndex((prev) => {
      const nextIndex = prev + 1;
      setCameraTarget(
        getCameraWaypoint(nextIndex, steps.length, initialCameraTarget),
      );
      return nextIndex;
    });
  };

  // -------------------------
  // Final submit
  // -------------------------
  const handleSubmit = async () => {
    setSubmitError("");
    setSubmitting(true);

    const tier = calculateTier(answers);
    const summary = generateClientSummary(answers, tier);
    const userContact = answers.email || answers.contact || "";

    try {
      const response = await fetch(
        "https://apply.sasha13studio.pro/submit.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            data: JSON.stringify({
              answers,
              tier,
              summary,
              contact: userContact,
            }),
          }),
        },
      );

      if (response.ok) {
        setSubmitted(true);
      } else {
        setSubmitError(
          "Une erreur est survenue pendant l'envoi. Reessayez dans quelques instants.",
        );
      }
    } catch (err) {
      console.error(err);
      setSubmitError(
        "Impossible d'envoyer votre recommandation pour le moment.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditAnswers = () => {
    setSubmitted(false);
    setSubmitting(false);
    setSubmitError("");
    setStepIndex(steps.length - 1);
    setCameraTarget(
      getCameraWaypoint(steps.length - 1, steps.length, initialCameraTarget),
    );
  };

  // =========================
  // FINAL SUMMARY SCREEN
  // =========================
  if (stepIndex >= steps.length) {
    const tier = calculateTier(answers);
    const summary = generateClientSummary(answers, tier);
    const answeredCount = steps.reduce((count, s, idx) => {
      const key = s.key ?? idx;
      return answers[key] ? count + 1 : count;
    }, 0);
    const recipient = answers.email || answers.contact || "votre email";
    const firstName = answers.name || "vous";

    if (resultPhase !== "ready") {
      return (
        <motion.div
          className="quiz-summary summary-loading"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="summary-loader" aria-hidden="true">
            <span className="summary-loader-dot" />
            <span className="summary-loader-dot" />
            <span className="summary-loader-dot" />
          </div>
          <p className="summary-loading-kicker">Preparation</p>
          <h2 className="summary-title">J'assemble votre recommandation</h2>
          <p className="client-summary">
            Je relis vos reponses et je compose une proposition adaptee a votre
            projet.
          </p>
        </motion.div>
      );
    }

    return (
      <motion.div
        className="quiz-summary"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="summary-title">Voici ce que je vous proposerais</h2>
        <p className="summary-lead">
          Merci {firstName}. Votre parcours dans le studio est termine, voici
          une direction claire pour la suite.
        </p>

        <div className="summary-meta-row" aria-label="Resume du parcours">
          <p className="summary-meta-pill">{answeredCount} reponses</p>
          <p className="summary-meta-pill">{totalQuestionCount} questions</p>
          <p className="summary-meta-pill">{stepSections.length} themes</p>
        </div>

        <div className="tier-card">
          <p className="tier-eyebrow">Recommandation</p>
          <h3 className="tier-name">{tier}</h3>
        </div>

        <p className="client-summary">{summary}</p>

        <div className="summary-delivery-card">
          <p className="summary-delivery-label">Envoi de votre recommandation</p>
          <p className="summary-delivery-value">{recipient}</p>
          <p className="summary-delivery-note">
            Vous pourrez revenir en arriere pour ajuster une reponse avant
            l'envoi.
          </p>
        </div>

        <details className="answers-details">
          <summary>Voir le détail de vos réponses</summary>

          <ul className="answers-list">
            {steps.map((s, idx) => {
              const key = s.key ?? idx;
              const answer = answers[key];
              if (!answer) return null;

              const selected = s.options?.find((opt) => opt.value === answer);

              return (
                <li key={key} className="answer-item">
                  <p className="answer-question">
                    {interpolate(s.question, answers)}
                  </p>
                  <p className="answer-value">
                    {selected ? selected.label : answer}
                  </p>
                </li>
              );
            })}
          </ul>
        </details>

        {submitError ? (
          <p className="submit-feedback error" role="alert">
            {submitError}
          </p>
        ) : null}

        {submitting ? (
          <p className="submit-feedback pending" aria-live="polite">
            Envoi en cours... je prepare votre recommandation.
          </p>
        ) : null}

        {submitted ? (
          <p className="thank-you" role="status" aria-live="polite">
            Merci. Votre recommandation personnalisee sera envoyee tres bientot
            a {recipient}.
          </p>
        ) : null}

        <div className="summary-actions">
          <button
            type="button"
            onClick={handleEditAnswers}
            className="summary-secondary-button"
            disabled={submitting}
          >
            Modifier mes reponses
          </button>

          {!submitted ? (
            <button
              onClick={handleSubmit}
              className="submit-button premium"
              disabled={submitting}
            >
              {submitting
                ? "Envoi en cours..."
                : "Recevoir cette recommandation"}
            </button>
          ) : null}
        </div>
      </motion.div>
    );
  }

  // =========================
  // QUIZ STEP SCREEN
  // =========================
  return (
    <div className="quiz">
      <div className="question-wrapper">
        <h2 className="quiz-prompt">{interpolate(step.question, answers)}</h2>
      </div>

      <QuizProgress
        currentStepNumber={currentStepNumber}
        totalSteps={totalSteps}
        sectionLabel={currentSection.label}
        currentQuestionNumber={currentQuestionNumber}
        totalQuestionCount={totalQuestionCount}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          className="quiz-step-shell"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -22 }}
          transition={{ duration: 0.42, ease: "easeOut" }}
        >
          <QuizStep
            step={step}
            textInput={textInput}
            setTextInput={setTextInput}
            textError={textError}
            onSelect={handleSelect}
            onTextSubmit={handleTextSubmit}
          />

          <QuizNavigation
            canGoBack={stepIndex > 0}
            onBack={goBack}
            currentQuestionNumber={currentQuestionNumber}
            totalQuestionCount={totalQuestionCount}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
