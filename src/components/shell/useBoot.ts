"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useSound } from "@/components/sound/SoundProvider";

const KEY = "pzs.boot";
const listeners = new Set<() => void>();

const store = {
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  read() {
    try {
      return sessionStorage.getItem(KEY) === "1";
    } catch {
      return false;
    }
  },
  finish() {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    document.documentElement.setAttribute("data-booted", "");
    listeners.forEach((fn) => fn());
  },
};

// Mechanika intro: ładowanie → „naciśnij ekran” → wyjście
export function useBoot({ ticks, leaveMs }: { ticks: number; leaveMs: number }) {
  const booted = useSyncExternalStore(store.subscribe, store.read, () => false);
  const [tick, setTick] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const sound = useSound();
  const { unlock, play } = sound;

  const total = ticks + 6;
  const ready = tick >= total;
  const progress = Math.min(1, tick / ticks);

  useEffect(() => {
    if (booted) return;
    const root = document.documentElement;
    root.setAttribute("data-lock-scroll", "");
    return () => root.removeAttribute("data-lock-scroll");
  }, [booted]);

  useEffect(() => {
    if (booted || ready) return;
    const timer = setTimeout(() => setTick((t) => t + 1), tick === 0 ? 500 : 55 + ((tick * 53) % 90));
    return () => clearTimeout(timer);
  }, [booted, ready, tick]);

  const proceed = useCallback(() => {
    if (leaving) return;
    unlock();
    if (!ready) {
      setTick(total);
      return;
    }
    play("boot");
    setLeaving(true);
    setTimeout(store.finish, leaveMs);
  }, [leaveMs, leaving, play, ready, total, unlock]);

  const skip = useCallback(() => {
    unlock();
    store.finish();
  }, [unlock]);

  useEffect(() => {
    if (booted) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "F11" || event.metaKey || event.ctrlKey || event.altKey) return;
      event.preventDefault();
      if (event.key === "Escape") skip();
      else proceed();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [booted, proceed, skip]);

  return { booted, tick, progress, ready, leaving, proceed, skip, sfx: sound.sfx, music: sound.music };
}

export const BOOT_STEPS = [
  "Inicjalizacja systemu PZS E-SPORTS...",
  "Weryfikacja plików gry...",
  "Pobieranie: regulamin.txt",
  "Wczytywanie drabinek turniejowych...",
  "Szyfrowanie danych osobowych (RODO)...",
  "Synchronizacja z serwerem...",
  "Połączono.",
];

export const stepFor = (progress: number) => BOOT_STEPS[Math.min(BOOT_STEPS.length - 1, Math.floor(progress * (BOOT_STEPS.length - 1)))];
