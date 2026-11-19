"use client";

import { useSyncExternalStore } from "react";
import { useNow } from "@/hooks/useNow";
import type { SlotStat } from "@/lib/queries";

// --- SLOTY: jeden wspólny odczyt /api/slots dla wszystkich liczników na stronie ---

let shared: SlotStat[] | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

async function refresh() {
  try {
    const res = await fetch("/api/slots", { cache: "no-store" });
    if (res.ok) {
      shared = (await res.json()) as SlotStat[];
      listeners.forEach((fn) => fn());
    }
  } catch {
    // sieć szkolna potrafi mrugnąć – kolejny tick spróbuje ponownie
  }
}

function loop() {
  timer = setTimeout(async () => {
    if (document.visibilityState === "visible") await refresh();
    if (listeners.size > 0) loop();
    else timer = null;
  }, 8_000);
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  if (!timer) loop();
  return () => {
    listeners.delete(fn);
  };
}

export type LiveStat = { taken: number; approved: number; pending: number; max: number };

export function useSlotStat(initial: SlotStat[]): LiveStat {
  const stats = useSyncExternalStore(
    subscribe,
    () => shared ?? initial,
    () => initial,
  );
  return stats[0] ?? { taken: 0, approved: 0, pending: 0, max: 8 };
}

export function LiveSlotCount({ initial, className = "" }: { initial: SlotStat[]; className?: string }) {
  const stat = useSlotStat(initial);
  return (
    <span className={`tabular inline-flex overflow-hidden ${className}`} aria-live="polite">
      <span key={stat.taken} className="inline-block animate-count-in">
        {stat.taken}
      </span>
      /{stat.max}
    </span>
  );
}

// --- ODLICZANIE ---

const two = (n: number) => String(Math.max(0, n)).padStart(2, "0");

function split(target: string, now: number | null) {
  if (now === null) return null;
  const left = Math.max(0, Date.parse(target) - now);
  return {
    days: Math.floor(left / 86_400_000),
    hours: Math.floor(left / 3_600_000) % 24,
    minutes: Math.floor(left / 60_000) % 60,
    seconds: Math.floor(left / 1000) % 60,
  };
}

export function CountdownInline({ target, className = "", seconds = true }: { target: string; className?: string; seconds?: boolean }) {
  const parts = split(target, useNow());
  if (!parts) return <span className={className}>--</span>;
  return (
    <span className={`tabular ${className}`} role="timer">
      {parts.days} d {two(parts.hours)}:{two(parts.minutes)}
      {seconds && `:${two(parts.seconds)}`}
    </span>
  );
}

const UNITS = ["dni", "godz", "min", "sek"] as const;

export function CountdownSegments({ target, className = "" }: { target: string; className?: string }) {
  const parts = split(target, useNow());
  const values = parts ? [two(parts.days), two(parts.hours), two(parts.minutes), two(parts.seconds)] : ["--", "--", "--", "--"];

  return (
    <div role="timer" className={`flex items-start justify-center gap-2.5 ${className}`}>
      {values.map((value, i) => (
        <div key={UNITS[i]} className="flex items-start gap-2.5">
          <div className="text-center">
            <div className="hx-digits w-[2.1ch] text-[34px]">{value}</div>
            <div className="mt-1.5 text-[12px] font-bold tracking-[0.16em] text-ui-muted uppercase">{UNITS[i]}</div>
          </div>
          {i < 3 && (
            <span aria-hidden className="hx-digits text-[28px] text-gold">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
