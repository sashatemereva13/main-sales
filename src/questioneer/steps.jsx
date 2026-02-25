import stepSectionsFr from "./steps.fr";
import stepSectionsEn from "./steps.en";

export const STEP_SECTION_SETS = {
  fr: stepSectionsFr,
  en: stepSectionsEn,
};

export function getStepSections(locale = "fr") {
  return STEP_SECTION_SETS[locale] || STEP_SECTION_SETS.fr;
}

export default STEP_SECTION_SETS.fr;
