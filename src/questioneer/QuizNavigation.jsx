export default function QuizNavigation({
  canGoBack,
  onBack,
  currentQuestionNumber,
  totalQuestionCount,
}) {
  if (!canGoBack) return null;

  return (
    <div className="quiz-footer">
      <p className="quiz-footer-note">
        Question {currentQuestionNumber}/{totalQuestionCount}
      </p>
      <button onClick={onBack} className="back-button subtle">
        ← retour
      </button>
    </div>
  );
}
