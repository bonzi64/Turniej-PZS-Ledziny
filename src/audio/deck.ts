// Cała warstwa audio jest syntezowana – zero plików, zero licencji

export type Cue = "hover" | "click" | "boot" | "deny" | "unlock" | "success" | "tick";

type Voice = { osc: OscillatorNode; gain: GainNode };

const midi = (note: number) => 440 * 2 ** ((note - 69) / 12);

// --- MUZYKA: Dm – B♭ – F – C, 84 BPM, 16 kroków na takt – spokojny „hextech”: pad, sub i dzwonki ---

const BPM = 84;
const STEP = 60 / BPM / 4;
const PROGRESSION = [
  { root: 38, chord: [62, 65, 69] },
  { root: 34, chord: [58, 62, 65] },
  { root: 41, chord: [60, 65, 69] },
  { root: 36, chord: [60, 64, 67] },
];
const BASS_STEPS = [0, 6, 8, 14];
const BASS_OCTAVE_UP = new Set([14]);
const ARP_ORDER = [0, 1, 2, 3, 2, 1, 2, 3];

class Sequencer {
  private timer: ReturnType<typeof setInterval> | null = null;
  private nextAt = 0;
  private step = 0;
  private bar = 0;

  constructor(
    private ctx: AudioContext,
    private out: GainNode,
    private noise: AudioBuffer,
  ) {}

  start() {
    if (this.timer) return;
    this.nextAt = this.ctx.currentTime + 0.08;
    this.timer = setInterval(() => this.schedule(), 25);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  private schedule() {
    while (this.nextAt < this.ctx.currentTime + 0.12) {
      this.play(this.step, this.bar, this.nextAt);
      this.nextAt += STEP;
      this.step = (this.step + 1) % 16;
      if (this.step === 0) this.bar = (this.bar + 1) % 32;
    }
  }

  private play(step: number, bar: number, at: number) {
    const { root, chord } = PROGRESSION[bar % 4];
    const section = Math.floor(bar / 8);

    // miękkie bicie serca na 1 i 3, cichy szelest od drugiej części
    if (step === 0 || step === 8) this.kick(at);
    if (section > 0 && step % 4 === 2) this.hat(at, 0.018);

    if (BASS_STEPS.includes(step)) this.bass(midi(root + (BASS_OCTAVE_UP.has(step) ? 12 : 0)), at);
    if (step === 0) this.pad(chord.map(midi), at, STEP * 16);
    // dzwonki: najpierw na ćwierćnutach, w trzeciej części gęściej
    const bellNotes = [...chord, chord[0] + 12];
    if (section >= 1 && step % 4 === 0) this.arp(midi(bellNotes[ARP_ORDER[(step / 2) % 8]] + 12), at);
    if (section >= 2 && step % 4 === 2) this.arp(midi(bellNotes[ARP_ORDER[(step / 2 + 3) % 8]] + 12), at);
  }

  private kick(at: number) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(95, at);
    osc.frequency.exponentialRampToValueAtTime(38, at + 0.28);
    gain.gain.setValueAtTime(0.32, at);
    gain.gain.exponentialRampToValueAtTime(0.001, at + 0.38);
    osc.connect(gain).connect(this.out);
    osc.start(at);
    osc.stop(at + 0.32);
  }

  private hat(at: number, level: number) {
    const src = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    src.buffer = this.noise;
    filter.type = "highpass";
    filter.frequency.value = 7500;
    gain.gain.setValueAtTime(level, at);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.05);
    src.connect(filter).connect(gain).connect(this.out);
    src.start(at, Math.random() * 0.5, 0.06);
  }

  private bass(freq: number, at: number) {
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    filter.type = "lowpass";
    filter.Q.value = 1;
    filter.frequency.setValueAtTime(420, at);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.2, at + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + STEP * 1.8);
    osc.connect(filter).connect(gain).connect(this.out);
    osc.start(at);
    osc.stop(at + STEP * 2);
  }

  private pad(freqs: number[], at: number, length: number) {
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    filter.type = "lowpass";
    filter.frequency.value = 760;
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.linearRampToValueAtTime(0.05, at + length * 0.4);
    gain.gain.linearRampToValueAtTime(0.0001, at + length);
    filter.connect(gain).connect(this.out);

    for (const freq of freqs) {
      for (const detune of [-9, 9]) {
        const osc = this.ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.value = freq;
        osc.detune.value = detune;
        osc.connect(filter);
        osc.start(at);
        osc.stop(at + length + 0.05);
      }
    }
  }

  // dzwonek: sinus i nieharmoniczny alikwot, długie wybrzmienie
  private arp(freq: number, at: number) {
    for (const [ratio, level] of [
      [1, 0.03],
      [2.76, 0.008],
    ] as const) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq * ratio;
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(level, at + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + STEP * 5);
      osc.connect(gain).connect(this.out);
      osc.start(at);
      osc.stop(at + STEP * 5.2);
    }
  }
}

// --- DECK ---

export class SoundDeck {
  private ctx: AudioContext | null = null;
  private sfxBus: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private sequencer: Sequencer | null = null;
  private lastHover = 0;

  sfx = true;
  music = true;
  sfxVolume = 0.7;
  musicVolume = 0.45;

  get ready() {
    return this.ctx?.state === "running";
  }

  setVolumes(sfx: number, music: number) {
    this.sfxVolume = sfx;
    this.musicVolume = music;
    const { ctx, sfxBus, musicBus } = this;
    if (!ctx || !sfxBus || !musicBus) return;
    sfxBus.gain.setTargetAtTime(sfx, ctx.currentTime, 0.05);
    if (this.music) musicBus.gain.setTargetAtTime(music * 0.7, ctx.currentTime, 0.1);
  }

  // wymaga gestu użytkownika – wołane z intro i przełączników
  unlock() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const ctx = new AudioContext();
      const master = ctx.createGain();
      const comp = ctx.createDynamicsCompressor();
      master.gain.value = 0.8;
      master.connect(comp).connect(ctx.destination);

      this.sfxBus = ctx.createGain();
      this.sfxBus.gain.value = this.sfxVolume;
      this.sfxBus.connect(master);

      this.musicBus = ctx.createGain();
      this.musicBus.gain.value = 0;
      this.musicBus.connect(master);

      const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

      this.ctx = ctx;
      this.noise = buffer;
      this.sequencer = new Sequencer(ctx, this.musicBus, buffer);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    this.applyMusic();
  }

  setSfx(on: boolean) {
    this.sfx = on;
  }

  setMusic(on: boolean) {
    this.music = on;
    this.applyMusic();
  }

  private applyMusic() {
    const { ctx, musicBus, sequencer } = this;
    if (!ctx || !musicBus || !sequencer) return;
    const now = ctx.currentTime;
    musicBus.gain.cancelScheduledValues(now);
    musicBus.gain.setValueAtTime(musicBus.gain.value, now);

    if (this.music) {
      sequencer.start();
      musicBus.gain.linearRampToValueAtTime(this.musicVolume * 0.7, now + 2.5);
    } else {
      musicBus.gain.linearRampToValueAtTime(0, now + 0.6);
      setTimeout(() => {
        if (!this.music) sequencer.stop();
      }, 700);
    }
  }

  play(cue: Cue) {
    const { ctx, sfxBus } = this;
    if (!this.sfx || !ctx || !sfxBus || ctx.state !== "running") return;
    const t = ctx.currentTime;

    switch (cue) {
      case "hover": {
        if (performance.now() - this.lastHover < 45) return;
        this.lastHover = performance.now();
        this.bell(2637, t, 0.08, 0.025);
        break;
      }
      case "click":
        this.bell(midi(81), t, 0.22, 0.07);
        this.bell(midi(88), t + 0.025, 0.18, 0.035);
        this.burst(t, 0.04, 0.06, 4200);
        break;
      case "tick":
        this.bell(1760, t, 0.05, 0.04);
        break;
      case "boot":
        // narastający szum jak otwierana brama hextech, potem akord dzwonków D–F–A–D–F
        this.swell(t, 0.7);
        [62, 65, 69, 74, 77].forEach((n, i) => this.bell(midi(n + 12), t + 0.55 + i * 0.09, 1.6, 0.07));
        this.blip("sine", midi(38), midi(38), t + 0.55, 1.4, 0.18);
        break;
      case "deny":
        this.blip("triangle", 220, 200, t, 0.12, 0.16);
        this.blip("triangle", 196, 160, t + 0.13, 0.18, 0.16);
        break;
      case "unlock":
        this.bell(midi(81), t, 0.6, 0.08);
        this.bell(midi(88), t + 0.1, 0.9, 0.08);
        break;
      case "success":
        [62, 65, 69, 74, 77, 81].forEach((n, i) => this.bell(midi(n + 12), t + i * 0.075, 1.2, 0.075));
        break;
    }
  }

  // dzwonek: czysty sinus i nieharmoniczny alikwot, jak metal hextech
  private bell(freq: number, at: number, length: number, level: number) {
    this.blip("sine", freq, freq, at, length, level);
    this.blip("sine", freq * 2.76, freq * 2.76, at, length * 0.45, level * 0.3);
  }

  private swell(at: number, length: number) {
    const { ctx, sfxBus, noise } = this;
    if (!ctx || !sfxBus || !noise) return;
    const src = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    src.buffer = noise;
    filter.type = "bandpass";
    filter.Q.value = 3;
    filter.frequency.setValueAtTime(300, at);
    filter.frequency.exponentialRampToValueAtTime(3200, at + length);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.22, at + length * 0.85);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + length + 0.15);
    src.connect(filter).connect(gain).connect(sfxBus);
    src.start(at, 0, length + 0.2);
  }

  private blip(type: OscillatorType, from: number, to: number, at: number, length: number, level: number): Voice | null {
    const { ctx, sfxBus } = this;
    if (!ctx || !sfxBus) return null;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, at);
    if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, at + length);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(level, at + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + length);
    osc.connect(gain).connect(sfxBus);
    osc.start(at);
    osc.stop(at + length + 0.02);
    return { osc, gain };
  }

  private burst(at: number, length: number, level: number, cutoff: number) {
    const { ctx, sfxBus, noise } = this;
    if (!ctx || !sfxBus || !noise) return;
    const src = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    src.buffer = noise;
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff, at);
    filter.frequency.exponentialRampToValueAtTime(120, at + length);
    gain.gain.setValueAtTime(level, at);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + length);
    src.connect(filter).connect(gain).connect(sfxBus);
    src.start(at, 0, length + 0.05);
  }
}
