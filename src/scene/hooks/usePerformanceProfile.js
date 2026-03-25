import { useEffect, useState } from "react";
import { createPerformanceProfile } from "../config/performanceProfile";

export function usePerformanceProfile() {
  const [profile, setProfile] = useState(() => createPerformanceProfile());

  useEffect(() => {
    const updateProfile = () => {
      setProfile(createPerformanceProfile());
    };

    window.addEventListener("resize", updateProfile);
    window.addEventListener("orientationchange", updateProfile);

    return () => {
      window.removeEventListener("resize", updateProfile);
      window.removeEventListener("orientationchange", updateProfile);
    };
  }, []);

  return profile;
}
