"use client";

import { useEffect, useRef } from "react";
import { SchoolLogo } from "@/components/brand/SchoolLogo";
import { HextechCore } from "@/components/hx/HextechCore";
import { GRAIN } from "@/components/shell/Backdrop";
import { stepFor, useBoot } from "@/components/shell/useBoot";
import { EVENT } from "@/content/event";

const LEAVE_MS = 820;
const FLIGHT = "cubic-bezier(0.77, 0, 0.175, 1)";

// Intro jak start klienta: rdzeń hextech składa się w takt ładowania, a po kliknięciu
// przelatuje na rdzeń banera strony startowej (albo rozpływa się, gdy banera nie ma na ekranie).
export function Intro() {
  const boot = useBoot({ ticks: 34, leaveMs: LEAVE_MS });
  const rune = useRef<HTMLDivElement>(null);
  const { finish } = boot;
  const pct = Math.round(boot.progress * 100);

  useEffect(() => {
    const from = rune.current;
    if (!boot.leaving || !from) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = document.querySelector<HTMLElement>("[data-rune-target]");
    const a = from.getBoundingClientRect();
    const b = target?.getBoundingClientRect();
    const visible = b && b.width > 0 && b.bottom > 0 && b.top < window.innerHeight;

    if (b && visible) {
      const dx = b.left + b.width / 2 - (a.left + a.width / 2);
      const dy = b.top + b.height / 2 - (a.top + a.height / 2);
      const flight = from.animate([{ transform: "none" }, { transform: `translate(${dx}px, ${dy}px) scale(${b.width / a.width})` }], {
        duration: LEAVE_MS - 60,
        easing: FLIGHT,
        fill: "forwards",
      });
      // rdzeń doleciał złożony – rdzeń banera ma się pokazać od razu cały, bez ponownego składania, i dopiero wtedy kończymy intro
      flight.finished
        .then(() => {
          document.documentElement.setAttribute("data-rune-landed", "");
          finish();
        })
        .catch(() => {});
    } else {
      from
        .animate(
          [
            { transform: "none", opacity: 1 },
            { transform: "scale(1.3)", opacity: 0 },
          ],
          { duration: 600, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "forwards" },
        )
        .finished.then(finish)
        .catch(() => {});
    }
  }, [boot.leaving, finish]);

  if (boot.booted) return null;

  return (
    <div
      data-boot
      data-leaving={boot.leaving ? "" : undefined}
      role="dialog"
      aria-modal="true"
      aria-label="Ekran startowy"
      onClick={boot.proceed}
      className="group/intro fixed inset-0 z-[100] overflow-hidden select-none"
    >
      <div className="absolute inset-0 bg-void transition-opacity delay-150 duration-[600ms] ease-out group-data-leaving/intro:opacity-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0b1a2e_0%,#050f1c_45%,#010a13_100%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: GRAIN, backgroundSize: "180px 180px" }} />
      </div>

      <div className="relative flex h-full flex-col items-center justify-center px-6 pb-24 text-center">
        <div ref={rune} className="relative grid size-[min(68vw,300px)] place-items-center will-change-transform">
          <HextechCore size="100%" progress={boot.progress} float={false} className="absolute inset-0" />
        </div>

        <div className="transition-opacity duration-200 group-data-leaving/intro:opacity-0">
          <h1 className="mt-10 font-display text-[36px] leading-none tracking-[0.05em] text-parchment sm:text-[52px]">Turniej PZS Lędziny</h1>
          <p className="mt-3 text-[14px] font-semibold tracking-[0.2em] text-gold uppercase sm:text-[16px]">
            League of Legends · {EVENT.weekday} {EVENT.dateLabel}
          </p>
          <p className="mt-3 inline-flex items-center gap-2 text-[14px] text-ui-muted">
            <SchoolLogo height={24} priority />
            {EVENT.school}
          </p>

          <p className={`mt-12 font-display text-[17px] tracking-[0.05em] ${boot.ready ? "animate-blink text-parchment" : "text-ui-faint"}`}>
            {boot.ready ? "Kliknij, aby kontynuować" : "Kliknięcie włączy pełny ekran"}
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 border-t border-hull bg-void/85 px-5 py-4 transition-opacity duration-200 group-data-leaving/intro:opacity-0">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-5 gap-y-2">
          <p className="w-full truncate text-left text-[13px] text-ui-muted sm:w-64 sm:shrink-0">{stepFor(boot.progress)}</p>
          <div className="hx-meter min-w-40 flex-1">
            <span style={{ width: `${pct}%`, transition: "width 200ms linear" }} />
          </div>
          <span className="w-10 text-right text-[13px] text-sand tabular">{pct}%</span>
          <button
            type="button"
            data-sfx=""
            onClick={(event) => {
              event.stopPropagation();
              boot.skip();
            }}
            className="text-[12px] font-bold tracking-[0.14em] text-ui-muted uppercase transition-colors hover:text-parchment"
          >
            Pomiń <span className="font-normal normal-case">(Esc)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
