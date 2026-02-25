import questionsFr from "./questions.fr";
import questionsEn from "./questions.en";

export const QUESTION_SETS = {
  fr: questionsFr,
  en: questionsEn,
};

export function getQuestions(locale = "fr") {
  return QUESTION_SETS[locale] || QUESTION_SETS.fr;
}

export default QUESTION_SETS.fr;
