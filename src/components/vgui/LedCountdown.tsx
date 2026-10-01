"use client";

import { PixelText } from "@/components/vgui/pixel";
import { useNow } from "@/hooks/useNow";

const two = (n: number) => String(Math.max(0, n)).padStart(2, "0");

export function LedCountdown({ target, dot = 5 }: { target: string; dot?: number }) {
  const now = useNow();
  const left = now === null ? null : Math.max(0, Date.parse(target) - now);

  const parts =
    left === null
      ? ["--", "--", "--", "--"]
      : [
          two(Math.floor(left / 86_400_000)),
          two(Math.floor(left / 3_600_000) % 24),
          two(Math.floor(left / 60_000) % 60),
          two(Math.floor(left / 1000) % 60),
        ];

  return (
    <div role="timer" className="inline-block" aria-label={left === null ? "Odliczanie" : `Do startu: ${parts[0]} dni ${parts[1]} godz ${parts[2]} min`}>
      <div className="vg-deep flex px-3 py-2 text-vg-gold">
        <PixelText text={parts.join(":")} dot={dot} ghost label={parts.join(":")} className="drop-shadow-[0_0_4px_rgb(196_181_80/0.5)]" />
      </div>
      <div className="mt-1 grid grid-cols-4 text-center text-[10px] tracking-[0.2em] text-vg-faint uppercase">
        <span>dni</span>
        <span>godz</span>
        <span>min</span>
        <span>sek</span>
      </div>
    </div>
  );
}
