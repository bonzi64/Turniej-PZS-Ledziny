"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function usePoll<T>(url: string, everyMs: number, initial: T) {
  const [data, setData] = useState(initial);
  const inflight = useRef(false);

  const refresh = useCallback(async () => {
    if (inflight.current) return;
    inflight.current = true;
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) setData((await res.json()) as T);
    } catch {
      // sieć szkolna potrafi mrugnąć – kolejny tick spróbuje ponownie
    } finally {
      inflight.current = false;
    }
  }, [url]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let alive = true;

    const loop = async () => {
      if (document.visibilityState === "visible") await refresh();
      if (alive) timer = setTimeout(loop, everyMs);
    };

    timer = setTimeout(loop, everyMs);
    const onVisible = () => document.visibilityState === "visible" && void refresh();
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      alive = false;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [everyMs, refresh]);

  return [data, refresh] as const;
}
