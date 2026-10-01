"use client";

import { createContext, type ReactNode, use, useEffect, useMemo, useSyncExternalStore } from "react";
import { type Cue, SoundDeck } from "@/audio/deck";
import { type AudioPrefs, audioPrefs } from "@/audio/prefs";

type SoundApi = AudioPrefs & {
  toggleSfx: () => void;
  toggleMusic: () => void;
  setVolume: (channel: "sfx" | "music", value: number) => void;
  play: (cue: Cue) => void;
  unlock: () => void;
};

const deck = new SoundDeck();
const SoundContext = createContext<SoundApi | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const prefs = useSyncExternalStore(audioPrefs.subscribe, audioPrefs.snapshot, audioPrefs.serverSnapshot);

  useEffect(() => {
    deck.setSfx(prefs.sfx);
    deck.setMusic(prefs.music);
    deck.setVolumes(prefs.sfxVolume, prefs.musicVolume);
  }, [prefs]);

  // dźwięki interfejsu przez delegację: wystarczy atrybut data-sfx na elemencie
  useEffect(() => {
    let hovered: Element | null = null;

    const onOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const target = (event.target as Element | null)?.closest?.("[data-sfx]") ?? null;
      if (target && target !== hovered && !target.matches(":disabled")) deck.play("hover");
      hovered = target;
    };

    const onClick = (event: MouseEvent) => {
      deck.unlock();
      const target = (event.target as Element | null)?.closest?.("[data-sfx]");
      const cue = target?.getAttribute("data-sfx");
      if (target && cue !== "mute" && !target.matches(":disabled")) deck.play((cue || "click") as Cue);
    };

    document.addEventListener("pointerover", onOver);
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  const api = useMemo<SoundApi>(
    () => ({
      ...prefs,
      toggleSfx: () => {
        deck.unlock();
        deck.setSfx(!prefs.sfx);
        audioPrefs.update({ sfx: !prefs.sfx });
      },
      toggleMusic: () => {
        deck.unlock();
        deck.setMusic(!prefs.music);
        audioPrefs.update({ music: !prefs.music });
      },
      setVolume: (channel, value) => {
        const patch = channel === "sfx" ? { sfxVolume: value } : { musicVolume: value };
        const next = { ...prefs, ...patch };
        deck.setVolumes(next.sfxVolume, next.musicVolume);
        audioPrefs.update(patch);
      },
      play: (cue) => deck.play(cue),
      unlock: () => deck.unlock(),
    }),
    [prefs],
  );

  return <SoundContext value={api}>{children}</SoundContext>;
}

export function useSound() {
  const api = use(SoundContext);
  if (!api) throw new Error("useSound poza <SoundProvider>");
  return api;
}
