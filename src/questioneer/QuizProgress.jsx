import { getCopy } from "../i18n/copy";

export default function QuizProgress({
  locale = "fr",
  currentStepNumber,
  totalSteps,
  sectionLabel,
  currentQuestionNumber,
  totalQuestionCount,
}) {
  const copy = getCopy(locale);
  const progress = currentStepNumber / totalSteps;
  const questionProgress = currentQuestionNumber / Math.max(totalQuestionCount, 1);
  const percent = Math.round(questionProgress * 100);
  const routeNodes = Array.from({ length: totalSteps }, (_, index) => {
    const stepNumber = index + 1;
    const ratio = totalSteps <= 1 ? 0 : index / (totalSteps - 1);
    const state =
      stepNumber < currentStepNumber
        ? "is-completed"
        : stepNumber === currentStepNumber
          ? "is-current"
          : "is-pending";

    return { stepNumber, ratio, state };
  });

  return (
    <div className="progress-container">
      <div className="progress-text">
        <div className="progress-row">
          <p className="progress-kicker">
            {copy.progress.step} {currentStepNumber}/{totalSteps}
          </p>
          <p className="progress-percent">{percent}%</p>
        </div>

        <div className="progress-row progress-row-detail">
          <p className="progress-section">{sectionLabel}</p>
          <p className="progress-question">
            {copy.progress.question} {currentQuestionNumber}/{totalQuestionCount}
          </p>
        </div>
      </div>

      <div className="progress-route-shell">
        <p className="progress-route-label">{copy.progress.routeLabel}</p>

        <div className="progress-route" aria-hidden="true">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>

          {routeNodes.map((node) => (
            <div
              key={node.stepNumber}
              className={`progress-node ${node.state}`}
              style={{ left: `${node.ratio * 100}%` }}
            >
              <span className="progress-node-core" />
              <span className="progress-node-ring" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
