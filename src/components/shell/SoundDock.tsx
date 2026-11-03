"use client";

import { toggleFullscreen, useFullscreen } from "@/components/shell/fullscreen";
import { useSound } from "@/components/sound/SoundProvider";

export function SoundDock({ compact = false }: { compact?: boolean }) {
  const { sfx, music, sfxVolume, musicVolume, toggleSfx, toggleMusic, setVolume, play } = useSound();
  const fullscreen = useFullscreen();

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Dźwięk i ekran">
      {!compact && fullscreen !== null && (
        <button type="button" data-sfx="" aria-pressed={fullscreen} onClick={toggleFullscreen} className="vg-btn min-w-30 text-[11px]">
          FULLSCREEN: {fullscreen ? "ON" : "OFF"}
        </button>
      )}
      <button
        type="button"
        data-sfx="mute"
        aria-pressed={sfx}
        onClick={() => {
          toggleSfx();
          if (!sfx) play("unlock");
        }}
        className="vg-btn min-w-[4.5rem] text-[11px]"
      >
        {compact ? "SFX" : "SFX:"} {sfx ? "ON" : "OFF"}
      </button>
      <button type="button" data-sfx="mute" aria-pressed={music} onClick={toggleMusic} className="vg-btn min-w-[5.5rem] text-[11px]">
        {compact ? "MUS" : "MUSIC:"} {music ? "ON" : "OFF"}
      </button>
      {!compact && (
        <div className="vg-deep flex h-6 items-center gap-2 px-2 text-[10px] text-vg-muted">
          <label className="flex items-center gap-1.5">
            SFX
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={sfxVolume}
              onChange={(e) => setVolume("sfx", Number(e.target.value))}
              onPointerUp={() => play("tick")}
              className="vg-slider w-16"
              aria-label="Głośność efektów"
            />
          </label>
          <label className="flex items-center gap-1.5">
            MUS
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={musicVolume}
              onChange={(e) => setVolume("music", Number(e.target.value))}
              className="vg-slider w-16"
              aria-label="Głośność muzyki"
            />
          </label>
        </div>
      )}
    </div>
  );
}
