"use client";

import { type ReactNode, useRef } from "react";
import { openTab, useHash } from "@/components/vgui/tab-store";
import { CloseBox } from "@/components/vgui/Window";
import { Emblem } from "@/components/vgui/pixel";

export type TabSpec = { id: string; label: string; content: ReactNode };

export function TabbedWindow({
  title,
  tabs,
  fallback,
  closeHref,
  status,
}: {
  title: string;
  tabs: TabSpec[];
  fallback: string;
  closeHref?: string;
  status?: ReactNode;
}) {
  const hash = useHash();
  const active = tabs.some((t) => t.id === hash) ? hash : fallback;
  const frame = useRef<HTMLElement>(null);

  const select = (id: string) => {
    openTab(id);
    const top = frame.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) frame.current?.scrollIntoView({ block: "start" });
  };

  return (
    <section ref={frame} aria-label={title} className="vg-window scroll-mt-16">
      <header className="vg-titlebar">
        <Emblem className="text-vg-gold" />
        <h1 className="min-w-0 truncate">{title}</h1>
        {closeHref && <CloseBox href={closeHref} />}
      </header>

      <div role="tablist" aria-label={title} className="vg-tabs mt-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-controls={`panel-${tab.id}`}
            aria-selected={tab.id === active}
            data-sfx=""
            onClick={() => select(tab.id)}
            className="vg-tab"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="vg-tab-body">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={tab.id !== active}
            className="p-3 sm:p-5"
          >
            {tab.content}
          </div>
        ))}
      </div>

      {status && <footer className="vg-statusbar">{status}</footer>}
    </section>
  );
}
