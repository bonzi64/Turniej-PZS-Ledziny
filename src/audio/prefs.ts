export type AudioPrefs = { sfx: boolean; music: boolean; sfxVolume: number; musicVolume: number };

const KEY = "pzs.audio";
const DEFAULTS: AudioPrefs = { sfx: true, music: true, sfxVolume: 0.7, musicVolume: 0.45 };
const listeners = new Set<() => void>();
let cached: AudioPrefs | null = null;

function read(): AudioPrefs {
  if (cached) return cached;
  try {
    const raw = localStorage.getItem(KEY);
    cached = raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<AudioPrefs>) } : DEFAULTS;
  } catch {
    cached = DEFAULTS;
  }
  return cached;
}

export const audioPrefs = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  snapshot: read,
  serverSnapshot: () => DEFAULTS,
  update(patch: Partial<AudioPrefs>) {
    cached = { ...read(), ...patch };
    try {
      localStorage.setItem(KEY, JSON.stringify(cached));
    } catch {}
    listeners.forEach((fn) => fn());
  },
};
