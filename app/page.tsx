"use client";

import { useState } from "react";
import { TabBar } from "@/components/TabBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ErrorBanner } from "@/components/ErrorBanner";
import { ExtractTab } from "@/components/ExtractTab";
import { MergeTab } from "@/components/MergeTab";

type Tab = "extract" | "merge";

export default function Home() {
  const [tab, setTab] = useState<Tab>("extract");
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (t: Tab) => {
    setError(null);
    setTab(t);
  };

  return (
    <div className="px-6 py-15">
      <div className="max-w-[420px] mx-auto">
        <header className="flex justify-between items-center mb-1.5">
          <h1 className="text-lg font-medium text-text-dark">pdf pages</h1>
          <ThemeToggle />
        </header>
        <p className="text-sm text-text-muted mb-9">
          get the specific textbook pages you need
        </p>

        <TabBar active={tab} onChange={handleTabChange} />
        <ErrorBanner message={error} />

        {tab === "extract" ? (
          <ExtractTab key="extract" onError={setError} />
        ) : (
          <MergeTab key="merge" onError={setError} />
        )}
      </div>
    </div>
  );
}
