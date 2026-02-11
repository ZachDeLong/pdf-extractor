"use client";

import { useCallback, useSyncExternalStore } from "react";

type Theme = "dark" | "light";

function getTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem("theme") as Theme) || "dark";
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark" as Theme);

  const toggle = useCallback(() => {
    const next = getTheme() === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("light", next === "light");
    // Dispatch storage event so useSyncExternalStore picks it up
    window.dispatchEvent(new StorageEvent("storage"));
  }, []);

  return { theme, toggle };
}
