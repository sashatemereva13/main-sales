import { useEffect, useState } from "react";
import { createPerformanceProfile } from "../config/performanceProfile";

export function usePerformanceProfile() {
  const [profile, setProfile] = useState(() => createPerformanceProfile());

  useEffect(() => {
    const updateProfile = () => {
      setProfile(createPerformanceProfile());
    };
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection ||
      null;

    window.addEventListener("resize", updateProfile);
    window.addEventListener("orientationchange", updateProfile);
    connection?.addEventListener?.("change", updateProfile);

    return () => {
      window.removeEventListener("resize", updateProfile);
      window.removeEventListener("orientationchange", updateProfile);
      connection?.removeEventListener?.("change", updateProfile);
    };
  }, []);

  return profile;
}
