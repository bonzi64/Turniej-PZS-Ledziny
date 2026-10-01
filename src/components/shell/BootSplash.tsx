"use client";

import { SchoolLogo } from "@/components/brand/SchoolLogo";
import { stepFor, useBoot } from "@/components/shell/useBoot";
import { Emblem, PixelText } from "@/components/vgui/pixel";

const BLOCKS = 30;

export function BootSplash({ host }: { host: string }) {
  const boot = useBoot({ ticks: BLOCKS, leaveMs: 560 });
  if (boot.booted) return null;

  return (
    <div data-boot role="dialog" aria-modal="true" aria-label="Ekran startowy" onClick={boot.proceed} className="fixed inset-0 z-[100] cursor-default overflow-hidden bg-black select-none">
      <div className={`relative flex h-full flex-col items-center justify-center px-4 ${boot.leaving ? "animate-crt-off" : "animate-flicker"}`}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,#10182a_0%,#000_70%)]" />

        {!boot.ready ? (
          <div className="vg-window relative w-full max-w-[430px]" onClick={(e) => e.stopPropagation()}>
            <div className="vg-titlebar">
              <Emblem className="text-vg-gold" />
              <span>Łączenie z serwerem...</span>
            </div>
            <div className="space-y-3 px-4 pb-4">
              <p className="text-[12px] text-vg-muted">{host}</p>
              <p className="min-h-5 text-[13px]">{stepFor(boot.progress)}</p>
              <div className="vg-progress">
                {Array.from({ length: Math.min(boot.tick, BLOCKS) }, (_, i) => (
                  <span key={i} />
                ))}
              </div>
              <div className="flex justify-end">
                <button type="button" data-sfx="" onClick={boot.skip} className="vg-btn min-w-20">
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col items-center text-center">
            <SchoolLogo height={120} priority className="mb-8 drop-shadow-[0_0_24px_rgb(0_112_204/0.35)]" />
            <PixelText text="PZS" dot={14} animate className="max-w-[80vw] text-vg-gold drop-shadow-[0_0_14px_rgb(196_181_80/0.5)]" />
            <p className="mt-5 text-[13px] tracking-[0.55em] text-vg-muted uppercase">E-sports · turniej 2026</p>
          </div>
        )}

        <div className="absolute right-0 bottom-[12%] left-0 text-center">
          {boot.ready ? (
            <p className="animate-blink px-4 text-[15px] tracking-[0.4em] text-vg-text uppercase">Naciśnij ekran aby kontynuować</p>
          ) : (
            <p className="px-4 text-[13px] tracking-[0.35em] text-vg-faint uppercase">Naciśnij F11 dla pełnej immersji</p>
          )}
          <p className="mt-3 text-[11px] tracking-[0.2em] text-vg-faint uppercase">
            SFX: {boot.sfx ? "on" : "off"} · Music: {boot.music ? "on" : "off"} · Esc pomija intro
          </p>
        </div>

        <div className="crt-lines pointer-events-none absolute inset-0" />
      </div>
    </div>
  );
}
