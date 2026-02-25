import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { getCopy } from "../i18n/copy";

export default function QuizStep({
  locale = "fr",
  step,
  textInput,
  setTextInput,
  textError,
  onSelect,
  onTextSubmit,
}) {
  const copy = getCopy(locale);
  const [activeChoice, setActiveChoice] = useState(null);
  const selectTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (selectTimerRef.current) {
        window.clearTimeout(selectTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setActiveChoice(null);
  }, [step]);

  const handleChoiceClick = (value) => {
    setActiveChoice(value);

    if (selectTimerRef.current) {
      window.clearTimeout(selectTimerRef.current);
    }

    selectTimerRef.current = window.setTimeout(() => {
      onSelect(value);
    }, 130);
  };

  if (step.type === "text") {
    const maxLength = step.maxLength ?? 160;
    const inputType = step.inputType ?? "text";
    const isOptional = step.required === false;
    const canSubmit = isOptional || Boolean(textInput.trim());
    const placeholder =
      step.placeholder ??
      (inputType === "email"
        ? copy.quizStep.emailPlaceholder
        : inputType === "url"
          ? copy.quizStep.urlPlaceholder
          : copy.quizStep.textPlaceholder);

    return (
      <form
        className="text-input-group"
        onSubmit={(e) => {
          e.preventDefault();
          onTextSubmit();
        }}
      >
        <div className="text-input-shell">
          <input
            type={inputType}
            className="text-input"
            placeholder={placeholder}
            value={textInput}
            autoComplete={inputType === "email" ? "email" : "off"}
            autoFocus
            maxLength={maxLength}
            onChange={(e) => setTextInput(e.target.value)}
            aria-invalid={Boolean(textError)}
            aria-describedby="quiz-text-meta"
          />

          <div className="text-input-meta" id="quiz-text-meta">
            <span className="text-input-hint">{copy.quizStep.enterToContinue}</span>
            <span className="text-input-counter">
              {textInput.trim().length}/{maxLength}
            </span>
          </div>
        </div>

        {textError ? <p className="text-input-error">{textError}</p> : null}

        <button
          type="submit"
          className="next-button"
          disabled={!canSubmit}
        >
          {isOptional && !textInput.trim() ? copy.quizStep.skip : copy.quizStep.continue}
        </button>
      </form>
    );
  }

  return (
    <div className="quizChoice">
      <div className="choice-overlay">
        {step.options.map((opt) => (
          <motion.button
            key={opt.value}
            type="button"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleChoiceClick(opt.value)}
            aria-pressed={activeChoice === opt.value}
            className={`choice-card ${activeChoice === opt.value ? "is-active" : ""}`}
          >
            <p className="choice-label">{opt.label}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
