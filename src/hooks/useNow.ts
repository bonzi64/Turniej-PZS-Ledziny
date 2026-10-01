"use client";

import { useSyncExternalStore } from "react";

let now = 0;
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    now = Date.now();
    timer = setInterval(() => {
      now = Date.now();
      listeners.forEach((fn) => fn());
    }, 250);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

// null na serwerze i przy hydracji – komponent pokazuje wtedy placeholder
export function useNow(): number | null {
  return useSyncExternalStore(
    subscribe,
    () => (timer ? now : null),
    () => null,
  );
}
