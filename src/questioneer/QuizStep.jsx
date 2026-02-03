import { motion, AnimatePresence } from "framer-motion";

export default function QuizStep({
  step,
  stepIndex,
  textInput,
  setTextInput,
  onSelect,
  onTextSubmit,
}) {
  if (step.type === "text") {
    return (
      <div className="text-input-group">
        <input
          type="text"
          className="text-input"
          placeholder="Ce que vous ressentez…"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />

        <button
          onClick={onTextSubmit}
          className="next-button"
          disabled={!textInput.trim()}
        >
          continuer →
        </button>
      </div>
    );
  }

  return (
    <div className="quizChoice">
      <div className="choice-overlay">
        {step.options.map((opt) => (
          <motion.div
            key={opt.value}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(opt.value)}
            className="choice-card"
          >
            <p className="choice-label">{opt.label}</p>
            {opt.caption && <p className="choice-caption">{opt.caption}</p>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
