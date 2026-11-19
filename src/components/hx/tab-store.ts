"use client";

import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("hashchange", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("hashchange", listener);
  };
}

const read = () => decodeURIComponent(window.location.hash.slice(1));

// replaceState zamiast location.hash – bez skoku przewijania i z zachowaniem stanu routera Next
export function openTab(id: string) {
  window.history.replaceState(window.history.state, "", `#${id}`);
  listeners.forEach((fn) => fn());
}

export function useHash() {
  return useSyncExternalStore(subscribe, read, () => "");
}
