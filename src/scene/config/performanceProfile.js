const PERFORMANCE_PRESETS = Object.freeze({
  low: Object.freeze({
    quality: "low",
    dpr: 1,
    antialias: false,
    shadows: false,
    shadowMapSize: 512,
    grass: Object.freeze({
      count: 9000,
      bladeWidth: 1.1,
      bladeHeight: 2.0,
      segments: 3,
      textureSize: 128,
      alphaTest: 0.54,
      animate: false,
    }),
    trees: Object.freeze({
      count: 2,
      castShadow: false,
      receiveShadow: false,
    }),
    wildlife: Object.freeze({
      rabbitSlots: 0,
      paused: true,
    }),
    pavilion: Object.freeze({
      preserveGlass: false,
    }),
  }),
  medium: Object.freeze({
    quality: "medium",
    dpr: [1, 1.1],
    antialias: false,
    shadows: false,
    shadowMapSize: 768,
    grass: Object.freeze({
      count: 18000,
      bladeWidth: 1.18,
      bladeHeight: 2.2,
      segments: 4,
      textureSize: 192,
      alphaTest: 0.48,
      animate: true,
    }),
    trees: Object.freeze({
      count: 3,
      castShadow: false,
      receiveShadow: true,
    }),
    wildlife: Object.freeze({
      rabbitSlots: 1,
      paused: false,
    }),
    pavilion: Object.freeze({
      preserveGlass: false,
    }),
  }),
  high: Object.freeze({
    quality: "high",
    dpr: [1, 1.2],
    antialias: false,
    shadows: true,
    shadowMapSize: 1024,
    grass: Object.freeze({
      count: 26000,
      bladeWidth: 1.22,
      bladeHeight: 2.35,
      segments: 5,
      textureSize: 256,
      alphaTest: 0.42,
      animate: true,
    }),
    trees: Object.freeze({
      count: 4,
      castShadow: true,
      receiveShadow: true,
    }),
    wildlife: Object.freeze({
      rabbitSlots: 2,
      paused: false,
    }),
    pavilion: Object.freeze({
      preserveGlass: true,
    }),
  }),
});

function detectCapabilities() {
  if (typeof window === "undefined") {
    return {
      isMobile: false,
      isTablet: false,
      isWebKit: false,
      isAppleMobileGpu: false,
      cores: 8,
      memory: 8,
      coarsePointer: false,
      width: 1440,
      height: 900,
      connectionEffectiveType: "4g",
      connectionDownlink: 10,
      connectionRtt: 50,
      saveData: false,
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection ||
    null;
  const coarsePointer =
    window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
  const isMobile =
    /Android|iPhone|iPod|Mobile|Windows Phone/i.test(ua) ||
    /iPad/i.test(ua);
  const isTablet = /iPad|Tablet/i.test(ua);
  const isWebKit =
    /AppleWebKit/i.test(ua) &&
    !/Chrome|Chromium|CriOS|Edg|OPR|Firefox|FxiOS/i.test(ua);
  const isAppleMobileGpu =
    /iPhone|iPad|iPod/i.test(ua) ||
    (/Mac/i.test(platform) && coarsePointer);

  return {
    isMobile,
    isTablet,
    isWebKit,
    isAppleMobileGpu,
    coarsePointer,
    width,
    height,
    cores: navigator.hardwareConcurrency ?? 8,
    memory: navigator.deviceMemory ?? 8,
    connectionEffectiveType: connection?.effectiveType ?? "4g",
    connectionDownlink: connection?.downlink ?? 10,
    connectionRtt: connection?.rtt ?? 50,
    saveData: connection?.saveData ?? false,
  };
}

export function createPerformanceProfile() {
  const capabilities = detectCapabilities();
  const lowBandwidth =
    capabilities.saveData ||
    capabilities.connectionEffectiveType === "slow-2g" ||
    capabilities.connectionEffectiveType === "2g" ||
    capabilities.connectionDownlink <= 0.8 ||
    capabilities.connectionRtt >= 700;
  const mediumBandwidth =
    lowBandwidth ||
    capabilities.connectionEffectiveType === "3g" ||
    capabilities.connectionDownlink <= 1.5 ||
    capabilities.connectionRtt >= 300;
  const lowPower =
    capabilities.isWebKit ||
    capabilities.isAppleMobileGpu ||
    capabilities.cores <= 4 ||
    capabilities.memory <= 4 ||
    lowBandwidth;
  const midPower =
    capabilities.isWebKit ||
    capabilities.cores <= 8 ||
    capabilities.memory <= 8 ||
    mediumBandwidth;

  const preset = lowPower
    ? PERFORMANCE_PRESETS.low
    : midPower
      ? PERFORMANCE_PRESETS.medium
      : PERFORMANCE_PRESETS.high;

  return Object.freeze({
    ...preset,
    capabilities,
    flags: Object.freeze({
      lowPower,
      midPower,
      lowBandwidth,
      mediumBandwidth,
    }),
  });
}

export { PERFORMANCE_PRESETS };
