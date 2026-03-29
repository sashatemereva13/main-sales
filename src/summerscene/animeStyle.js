export const ANIME_STYLE = Object.freeze({
  outline: Object.freeze({
    // Global dial for toon line readability.
    // 1.0 = current intended look, lower = softer lines, higher = stronger cel lines.
    intensity: 1.0,
    color: "#5a79a8",
    opacity: 0.24,
    thicknessScale: 1.0,
  }),
});

export function outlineOpacity(baseOpacity = 0.24) {
  return baseOpacity * ANIME_STYLE.outline.intensity;
}

export function outlineThickness(baseThickness = 1.03) {
  return 1 + (baseThickness - 1) * ANIME_STYLE.outline.thicknessScale;
}
