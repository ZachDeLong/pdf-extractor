"use client";

import { cn } from "@/lib/utils";

type Tab = "extract" | "merge";

interface TabBarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <div className="flex gap-2 mb-8">
      {(["extract", "merge"] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "flex-1 rounded-lg border px-4 py-2.5 text-sm italic cursor-pointer transition-all duration-200 active:scale-[0.98]",
            active === tab
              ? "border-accent-warm text-accent-warm bg-accent-bg"
              : "border-border-default text-text-muted bg-bg-surface hover:border-accent-warm hover:text-text-primary"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
