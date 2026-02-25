import { getCopy } from "../i18n/copy";

export default function QuizNavigation({
  locale = "fr",
  canGoBack,
  onBack,
  currentQuestionNumber,
  totalQuestionCount,
}) {
  const copy = getCopy(locale);
  if (!canGoBack) return null;

  return (
    <div className="quiz-footer">
      <p className="quiz-footer-note">
        {copy.quizNav.question} {currentQuestionNumber}/{totalQuestionCount}
      </p>
      <button onClick={onBack} className="back-button subtle">
        {copy.quizNav.back}
      </button>
    </div>
  );
}
