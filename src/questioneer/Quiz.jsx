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

// -------------------------
// Main Quiz
// -------------------------
export default function Quiz() {
  const [answers, setAnswers] = useState({});
  const [stepIndex, setStepIndex] = useState(0);
  const [textInput, setTextInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const step = steps[stepIndex];
  const currentSection = getCurrentSection(stepIndex);

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

  // -------------------------
  // Navigation
  // -------------------------
  const goBack = () => {
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  // -------------------------
  // Step handlers
  // -------------------------
  const handleSelect = (value) => {
    const key = step.key ?? stepIndex;

    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));

    setStepIndex((prev) => prev + 1);
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;

    const key = step.key ?? stepIndex;

    setAnswers((prev) => ({
      ...prev,
      [key]: textInput.trim(),
    }));

    setTextInput("");
    setStepIndex((prev) => prev + 1);
  };

  // -------------------------
  // Final submit
  // -------------------------
  const handleSubmit = async () => {
    setSubmitting(true);

    const tier = calculateTier(answers);
    const summary = generateClientSummary(answers, tier);
    const userContact = answers.contact || "";

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
        alert("There was an error submitting your answers.");
      }
    } catch (err) {
      console.error(err);
      alert("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // FINAL SUMMARY SCREEN
  // =========================
  if (stepIndex >= steps.length) {
    const tier = calculateTier(answers);
    const summary = generateClientSummary(answers, tier);

    return (
      <motion.div
        className="quiz-summary"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="summary-title">Voici ce que je vous proposerais</h2>

        <div className="tier-card">
          <p className="tier-eyebrow">Recommandation</p>
          <h3 className="tier-name">{tier}</h3>
        </div>

        <p className="client-summary">{summary}</p>

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
                  <p className="answer-question">{s.question}</p>
                  <p className="answer-value">
                    {selected ? selected.label : answer}
                  </p>
                </li>
              );
            })}
          </ul>
        </details>

        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="submit-button premium"
            disabled={submitting}
          >
            {submitting ? "Envoi en cours…" : "Recevoir cette recommandation"}
          </button>
        ) : (
          <p className="thank-you">
            ✨ Merci — votre recommandation personnalisée vous sera envoyée très
            bientôt.
          </p>
        )}
      </motion.div>
    );
  }

  // =========================
  // QUIZ STEP SCREEN
  // =========================
  return (
    <div className="quiz">
      <div className="question-wrapper">
        <h2 className="quiz-prompt">{step.question}</h2>
      </div>

      <QuizProgress
        currentStepNumber={currentStepNumber}
        totalSteps={totalSteps}
        sectionLabel={currentSection.label}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4 }}
        >
          <QuizStep
            step={step}
            stepIndex={stepIndex}
            textInput={textInput}
            setTextInput={setTextInput}
            onSelect={handleSelect}
            onTextSubmit={handleTextSubmit}
          />

          <QuizNavigation canGoBack={stepIndex > 0} onBack={goBack} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
