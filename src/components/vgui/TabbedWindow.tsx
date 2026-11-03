"use client";

import { type ReactNode, useEffect, useRef } from "react";
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
  const strip = useRef<HTMLDivElement>(null);

  // na telefonie pasek zakładek przewija się w bok – aktywna musi być widoczna
  useEffect(() => {
    const row = strip.current;
    const tab = row?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!row || !tab) return;
    const left = tab.offsetLeft - 8;
    const right = tab.offsetLeft + tab.offsetWidth + 8;
    if (left < row.scrollLeft) row.scrollLeft = left;
    else if (right > row.scrollLeft + row.clientWidth) row.scrollLeft = right - row.clientWidth;
  }, [active]);

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

      <div ref={strip} role="tablist" aria-label={title} className="vg-tabs vg-tabs-scroll mt-0.5">
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
