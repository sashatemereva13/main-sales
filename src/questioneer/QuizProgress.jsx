export default function QuizProgress({
  currentStepNumber,
  totalSteps,
  sectionLabel,
}) {
  const progress = currentStepNumber / totalSteps;

  return (
    <div className="progress-container">
      <div className="progress-text"></div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  );
}
