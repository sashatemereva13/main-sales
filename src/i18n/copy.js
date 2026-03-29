import en from "./en";
import fr from "./fr";

export const DEFAULT_LOCALE = "fr";
export const SUPPORTED_LOCALES = Object.freeze(["fr", "en"]);

export const UI_COPY = Object.freeze({
  fr,
  en,
});

export function isSupportedLocale(locale) {
  return SUPPORTED_LOCALES.includes(locale);
}

export function normalizeLocale(locale) {
  return isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
}

export function getCopy(locale = DEFAULT_LOCALE) {
  return UI_COPY[normalizeLocale(locale)];
}

export function getLocaleOptions(copy) {
  return SUPPORTED_LOCALES.map((value) => ({
    value,
    label: value === "fr" ? copy.nav.localeFr : copy.nav.localeEn,
  }));
}

export function formatCopy(template, vars = {}) {
  return String(template).replace(/\{(.*?)\}/g, (_, key) =>
    vars[key] == null ? "" : String(vars[key]),
  );
}
