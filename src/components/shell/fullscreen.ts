"use client";

import { useSyncExternalStore } from "react";

// Przeglądarka pozwala wejść w pełny ekran tylko w odpowiedzi na kliknięcie lub klawisz –
// dlatego wywołujemy to z intro ("naciśnij ekran") i z przycisku w docku.
export function enterFullscreen() {
  const root = document.documentElement;
  if (document.fullscreenElement || !document.fullscreenEnabled || typeof root.requestFullscreen !== "function") return;
  root.requestFullscreen({ navigationUI: "hide" }).catch(() => {});
}

export function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  else enterFullscreen();
}

function subscribe(onChange: () => void) {
  document.addEventListener("fullscreenchange", onChange);
  return () => document.removeEventListener("fullscreenchange", onChange);
}

// null – render na serwerze albo przeglądarka bez pełnego ekranu (np. Safari na iPhonie)
export function useFullscreen(): boolean | null {
  return useSyncExternalStore(
    subscribe,
    () => (document.fullscreenEnabled ? Boolean(document.fullscreenElement) : null),
    () => null,
  );
}
