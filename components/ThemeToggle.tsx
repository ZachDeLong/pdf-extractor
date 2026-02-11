"use client";

import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="rounded border border-text-muted px-2 py-1 text-[0.7rem] italic text-text-muted cursor-pointer transition-all duration-200 hover:border-accent-warm hover:text-accent-warm active:scale-95"
    >
      {theme === "dark" ? "light" : "dark"}
    </button>
  );
}
