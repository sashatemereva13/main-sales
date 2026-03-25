const VARIANT_PRESETS = {
  dashboard: {
    accent: "#A7F0B7",
    accentSoft: "#E8FFF0",
    secondary: "#6EE7A8",
    secondarySoft: "#D9FFE7",
    glow: "#8EE6AA",
    motif: "dashboard",
  },
  translation: {
    accent: "#C6FFD8",
    accentSoft: "#F1FFF5",
    secondary: "#8FD7A5",
    secondarySoft: "#E4FFEB",
    glow: "#A3F5C6",
    motif: "translation",
  },
  checkout: {
    accent: "#FFD8B4",
    accentSoft: "#FFF3E5",
    secondary: "#F0AE83",
    secondarySoft: "#FFE6D0",
    glow: "#FFC999",
    motif: "checkout",
  },
  calendar: {
    accent: "#C8FFDB",
    accentSoft: "#F3FFF6",
    secondary: "#9EE8BA",
    secondarySoft: "#E1FFEA",
    glow: "#9DE6B8",
    motif: "calendar",
  },
  account: {
    accent: "#D2FFE2",
    accentSoft: "#F6FFF9",
    secondary: "#8AD2A1",
    secondarySoft: "#E8FFF0",
    glow: "#A9F0C5",
    motif: "account",
  },
  story: {
    accent: "#FFF1D6",
    accentSoft: "#FFF9ED",
    secondary: "#D8C099",
    secondarySoft: "#F9EED8",
    glow: "#FFE0AD",
    motif: "story",
  },
  manifesto: {
    accent: "#F3EDD8",
    accentSoft: "#FFFCEF",
    secondary: "#CDBF98",
    secondarySoft: "#F6F0DD",
    glow: "#EFE0B8",
    motif: "manifesto",
  },
  gallery: {
    accent: "#D7FFE6",
    accentSoft: "#F4FFF7",
    secondary: "#9BE2B7",
    secondarySoft: "#E8FFF0",
    glow: "#A8F3CA",
    motif: "gallery",
  },
  contact: {
    accent: "#D9FFEA",
    accentSoft: "#F3FFF8",
    secondary: "#94D8AF",
    secondarySoft: "#E6FFF0",
    glow: "#A5F0C0",
    motif: "contact",
  },
  motion: {
    accent: "#D5FFE7",
    accentSoft: "#F5FFF9",
    secondary: "#A0E5B8",
    secondarySoft: "#E7FFF0",
    glow: "#A4F6D0",
    motif: "motion",
  },
  micro: {
    accent: "#DCFFE8",
    accentSoft: "#F7FFF9",
    secondary: "#A8E7C0",
    secondarySoft: "#E9FFF1",
    glow: "#A6F3C7",
    motif: "micro",
  },
  orbital: {
    accent: "#DFFFF1",
    accentSoft: "#F7FFFB",
    secondary: "#8DE0C1",
    secondarySoft: "#E5FFF6",
    glow: "#A2F2D8",
    motif: "orbital",
  },
  page: {
    accent: "#E1FFE8",
    accentSoft: "#F8FFFA",
    secondary: "#A4DEB4",
    secondarySoft: "#EDFFF2",
    glow: "#B3F2C5",
    motif: "page",
  },
  feature: {
    accent: "#D9FFE5",
    accentSoft: "#F6FFF8",
    secondary: "#9EE4B7",
    secondarySoft: "#E9FFF0",
    glow: "#ACF0C2",
    motif: "feature",
  },
};

export function getPreviewVariant(item) {
  if (item.id.includes("3d")) return "orbital";
  if (item.id.includes("payment")) return "checkout";
  if (item.id.includes("booking")) return "calendar";
  if (item.id.includes("user-accounts")) return "account";
  if (item.id.includes("multilanguage")) return "translation";
  if (item.id.includes("cms")) return "dashboard";
  if (item.id.includes("portfolio")) return "gallery";
  if (item.id.includes("contact")) return "contact";
  if (item.id.includes("about")) return "story";
  if (item.id.includes("philosophy")) return "manifesto";
  if (item.id.includes("animation")) return "motion";
  if (item.id.includes("micro")) return "micro";
  return item.type === "page" ? "page" : "feature";
}

export function getItemPreviewArtwork(item, variant) {
  const preset = VARIANT_PRESETS[variant] || VARIANT_PRESETS.feature;
  const title = escapeXml(item.name);
  const subtitle = escapeXml(item.description);
  const motifMarkup = getMotifMarkup(preset);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 420" fill="none">
      <defs>
        <linearGradient id="bg" x1="210" y1="24" x2="210" y2="396" gradientUnits="userSpaceOnUse">
          <stop stop-color="#133D24"/>
          <stop offset="1" stop-color="#0A2316"/>
        </linearGradient>
        <radialGradient id="spot" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" transform="translate(210 112) rotate(90) scale(154 196)">
          <stop stop-color="${preset.accentSoft}" stop-opacity=".26"/>
          <stop offset="1" stop-color="${preset.accentSoft}" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="panel" x1="76" y1="78" x2="344" y2="342" gradientUnits="userSpaceOnUse">
          <stop stop-color="rgba(255,255,255,0.16)"/>
          <stop offset="1" stop-color="rgba(255,255,255,0.04)"/>
        </linearGradient>
        <radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" transform="translate(210 222) rotate(90) scale(122 128)">
          <stop stop-color="${preset.glow}" stop-opacity=".34"/>
          <stop offset="1" stop-color="${preset.glow}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="420" height="420" rx="48" fill="url(#bg)"/>
      <rect width="420" height="420" rx="48" fill="url(#spot)"/>
      <circle cx="210" cy="234" r="108" fill="url(#glow)"/>
      <rect x="54" y="52" width="312" height="268" rx="30" fill="rgba(4,20,11,0.42)" stroke="rgba(240,255,242,0.12)"/>
      <rect x="76" y="78" width="268" height="188" rx="24" fill="url(#panel)" stroke="rgba(255,255,255,0.08)"/>
      <rect x="96" y="98" width="76" height="10" rx="5" fill="${preset.accent}" fill-opacity=".86"/>
      <rect x="186" y="98" width="44" height="10" rx="5" fill="${preset.secondary}" fill-opacity=".56"/>
      <rect x="240" y="98" width="84" height="10" rx="5" fill="${preset.accent}" fill-opacity=".28"/>
      ${motifMarkup}
      <rect x="88" y="336" width="188" height="12" rx="6" fill="${preset.accentSoft}" fill-opacity=".92"/>
      <rect x="88" y="358" width="144" height="8" rx="4" fill="${preset.secondarySoft}" fill-opacity=".76"/>
      <text x="88" y="392" fill="rgba(232,255,236,0.84)" font-size="18" font-family="Arial, sans-serif">${title}</text>
      <text x="88" y="410" fill="rgba(188,232,198,0.64)" font-size="11" font-family="Arial, sans-serif">${truncate(subtitle, 48)}</text>
    </svg>
  `;

  return {
    src: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    alt: `${item.name} preview`,
  };
}

function getMotifMarkup(preset) {
  switch (preset.motif) {
    case "dashboard":
      return `
        <rect x="96" y="126" width="108" height="98" rx="18" fill="${preset.accent}" fill-opacity=".14" stroke="${preset.accent}" stroke-opacity=".26"/>
        <rect x="218" y="126" width="106" height="44" rx="16" fill="${preset.secondary}" fill-opacity=".16" stroke="${preset.secondary}" stroke-opacity=".24"/>
        <rect x="218" y="180" width="106" height="44" rx="16" fill="${preset.accentSoft}" fill-opacity=".12" stroke="${preset.accentSoft}" stroke-opacity=".18"/>
        <circle cx="132" cy="158" r="16" fill="${preset.secondary}"/>
        <rect x="156" y="148" width="30" height="8" rx="4" fill="${preset.accentSoft}"/>
        <rect x="156" y="166" width="22" height="8" rx="4" fill="${preset.accentSoft}" fill-opacity=".62"/>
      `;
    case "translation":
      return `
        <rect x="102" y="130" width="92" height="74" rx="18" fill="${preset.accent}" fill-opacity=".14" stroke="${preset.accent}" stroke-opacity=".24"/>
        <rect x="226" y="130" width="92" height="74" rx="18" fill="${preset.secondary}" fill-opacity=".16" stroke="${preset.secondary}" stroke-opacity=".26"/>
        <path d="M152 164h-28m14-14v28" stroke="${preset.accentSoft}" stroke-width="10" stroke-linecap="round"/>
        <path d="M252 150c20 22 32 34 40 42m-40 0c18-18 28-30 40-42" stroke="${preset.secondarySoft}" stroke-width="10" stroke-linecap="round"/>
      `;
    case "checkout":
      return `
        <rect x="106" y="130" width="208" height="112" rx="24" fill="${preset.accent}" fill-opacity=".14" stroke="${preset.accent}" stroke-opacity=".22"/>
        <rect x="126" y="154" width="168" height="18" rx="9" fill="${preset.secondary}" fill-opacity=".82"/>
        <rect x="126" y="186" width="112" height="14" rx="7" fill="${preset.accentSoft}" fill-opacity=".62"/>
        <rect x="126" y="212" width="84" height="14" rx="7" fill="${preset.accentSoft}" fill-opacity=".42"/>
        <rect x="248" y="186" width="46" height="40" rx="12" fill="${preset.secondarySoft}" fill-opacity=".82"/>
      `;
    case "calendar":
      return `
        <rect x="112" y="126" width="196" height="118" rx="24" fill="${preset.accent}" fill-opacity=".14" stroke="${preset.accent}" stroke-opacity=".24"/>
        <rect x="112" y="126" width="196" height="26" rx="24" fill="${preset.secondary}" fill-opacity=".82"/>
        <g fill="${preset.accentSoft}" fill-opacity=".82">
          <rect x="136" y="170" width="28" height="22" rx="8"/>
          <rect x="176" y="170" width="28" height="22" rx="8"/>
          <rect x="216" y="170" width="28" height="22" rx="8"/>
          <rect x="256" y="170" width="28" height="22" rx="8"/>
          <rect x="136" y="202" width="28" height="22" rx="8"/>
          <rect x="176" y="202" width="28" height="22" rx="8"/>
          <rect x="216" y="202" width="28" height="22" rx="8"/>
        </g>
      `;
    case "account":
      return `
        <circle cx="210" cy="156" r="34" fill="${preset.secondary}" fill-opacity=".88"/>
        <path d="M154 228c12-30 40-46 56-46s44 16 56 46" fill="${preset.accent}" fill-opacity=".18" stroke="${preset.accent}" stroke-opacity=".26" stroke-width="10" stroke-linecap="round"/>
        <rect x="130" y="118" width="160" height="132" rx="30" stroke="${preset.accentSoft}" stroke-opacity=".16"/>
      `;
    case "story":
    case "manifesto":
    case "page":
      return `
        <rect x="116" y="124" width="188" height="126" rx="22" fill="${preset.accent}" fill-opacity=".14" stroke="${preset.accent}" stroke-opacity=".24"/>
        <rect x="136" y="152" width="112" height="12" rx="6" fill="${preset.secondary}" fill-opacity=".82"/>
        <rect x="136" y="178" width="144" height="10" rx="5" fill="${preset.accentSoft}" fill-opacity=".52"/>
        <rect x="136" y="200" width="120" height="10" rx="5" fill="${preset.accentSoft}" fill-opacity=".42"/>
        <rect x="136" y="222" width="88" height="10" rx="5" fill="${preset.accentSoft}" fill-opacity=".32"/>
      `;
    case "gallery":
      return `
        <rect x="102" y="126" width="216" height="122" rx="24" fill="${preset.accent}" fill-opacity=".14" stroke="${preset.accent}" stroke-opacity=".24"/>
        <rect x="122" y="146" width="82" height="82" rx="18" fill="${preset.secondary}" fill-opacity=".28"/>
        <rect x="216" y="146" width="82" height="36" rx="14" fill="${preset.accentSoft}" fill-opacity=".54"/>
        <rect x="216" y="192" width="82" height="36" rx="14" fill="${preset.accentSoft}" fill-opacity=".28"/>
        <circle cx="144" cy="170" r="12" fill="${preset.secondary}"/>
        <path d="M122 218l22-20 18 16 20-26 22 30" stroke="${preset.accentSoft}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      `;
    case "contact":
      return `
        <rect x="112" y="138" width="196" height="100" rx="24" fill="${preset.accent}" fill-opacity=".14" stroke="${preset.accent}" stroke-opacity=".24"/>
        <path d="M132 162l78 54 78-54" stroke="${preset.secondary}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="132" y="162" width="156" height="52" rx="16" stroke="${preset.accentSoft}" stroke-opacity=".34"/>
      `;
    case "motion":
    case "micro":
    case "orbital":
      return `
        <circle cx="210" cy="186" r="42" fill="${preset.secondary}" fill-opacity=".18" stroke="${preset.secondary}" stroke-opacity=".34"/>
        <circle cx="210" cy="186" r="70" stroke="${preset.accent}" stroke-opacity=".22"/>
        <circle cx="210" cy="186" r="96" stroke="${preset.accentSoft}" stroke-opacity=".14"/>
        <circle cx="278" cy="186" r="10" fill="${preset.secondarySoft}"/>
        <circle cx="170" cy="132" r="8" fill="${preset.accent}"/>
      `;
    default:
      return `
        <rect x="118" y="132" width="184" height="110" rx="24" fill="${preset.accent}" fill-opacity=".14" stroke="${preset.accent}" stroke-opacity=".24"/>
        <rect x="140" y="158" width="140" height="16" rx="8" fill="${preset.secondary}" fill-opacity=".82"/>
        <rect x="140" y="188" width="92" height="12" rx="6" fill="${preset.accentSoft}" fill-opacity=".52"/>
      `;
  }
}

function truncate(value, length) {
  if (value.length <= length) return value;
  return `${value.slice(0, length - 3)}...`;
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
