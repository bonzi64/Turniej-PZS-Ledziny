"use client";

import type { ReactNode } from "react";
import { useHash } from "@/components/hx/tab-store";

export type TabSpec = { id: string; label: string; content: ReactNode };

// Zakładki strony startowej sterowane hashem (#regulamin, #zapisy...) – menu jest w górnej belce
export function TabPanels({ tabs, fallback }: { tabs: TabSpec[]; fallback: string }) {
  const hash = useHash();
  const active = tabs.some((t) => t.id === hash) ? hash : fallback;

  return (
    <>
      {tabs.map((tab) => (
        <section key={tab.id} id={`panel-${tab.id}`} aria-label={tab.label} hidden={tab.id !== active} className={tab.id === active ? "animate-[fade_240ms_ease-out]" : undefined}>
          {tab.content}
        </section>
      ))}
    </>
  );
}
