export default function QuizNavigation({ canGoBack, onBack }) {
  if (!canGoBack) return null;

  return (
    <div className="quiz-footer">
      <button onClick={onBack} className="back-button subtle">
        ← retour
      </button>
    </div>
  );
}
