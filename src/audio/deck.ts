// Cała warstwa audio jest syntezowana – zero plików, zero licencji

export type Cue = "hover" | "click" | "boot" | "ban" | "pick" | "deny" | "unlock" | "success" | "tick";

type Voice = { osc: OscillatorNode; gain: GainNode };

const midi = (note: number) => 440 * 2 ** ((note - 69) / 12);

// --- MUZYKA: Am – F – C – G, 104 BPM, 16 kroków na takt ---

const BPM = 104;
const STEP = 60 / BPM / 4;
const PROGRESSION = [
  { root: 45, chord: [57, 60, 64] },
  { root: 41, chord: [53, 57, 60] },
  { root: 48, chord: [55, 60, 64] },
  { root: 43, chord: [55, 59, 62] },
];
const BASS_STEPS = [0, 3, 6, 8, 10, 11, 14];
const BASS_OCTAVE_UP = new Set([6, 14]);
const ARP_ORDER = [0, 1, 2, 1, 0, 2, 1, 2];

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

    if (step % 4 === 0) this.kick(at);
    if (section > 0 && step % 4 === 2) this.hat(at, 0.05);
    if (section > 1 && step % 2 === 1) this.hat(at, 0.02);
    if (step === 4 || step === 12) this.snare(at, section > 0 ? 0.09 : 0.05);

    if (BASS_STEPS.includes(step)) this.bass(midi(root + (BASS_OCTAVE_UP.has(step) ? 12 : 0)), at);
    if (step === 0) this.pad(chord.map(midi), at, STEP * 16);
    if (section >= 2 && step % 2 === 0) this.arp(midi(chord[ARP_ORDER[(step / 2) % 8]] + 12), at);
  }

  private kick(at: number) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(140, at);
    osc.frequency.exponentialRampToValueAtTime(42, at + 0.22);
    gain.gain.setValueAtTime(0.55, at);
    gain.gain.exponentialRampToValueAtTime(0.001, at + 0.3);
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

  private snare(at: number, level: number) {
    const src = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    src.buffer = this.noise;
    filter.type = "bandpass";
    filter.frequency.value = 1800;
    filter.Q.value = 0.8;
    gain.gain.setValueAtTime(level, at);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.18);
    src.connect(filter).connect(gain).connect(this.out);
    src.start(at, Math.random() * 0.5, 0.2);
  }

  private bass(freq: number, at: number) {
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.value = freq;
    filter.type = "lowpass";
    filter.Q.value = 7;
    filter.frequency.setValueAtTime(900, at);
    filter.frequency.exponentialRampToValueAtTime(180, at + STEP * 1.6);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.16, at + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + STEP * 1.8);
    osc.connect(filter).connect(gain).connect(this.out);
    osc.start(at);
    osc.stop(at + STEP * 2);
  }

  private pad(freqs: number[], at: number, length: number) {
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    filter.type = "lowpass";
    filter.frequency.value = 1100;
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.linearRampToValueAtTime(0.045, at + length * 0.35);
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

  private arp(freq: number, at: number) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.018, at);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + STEP * 1.5);
    osc.connect(gain).connect(this.out);
    osc.start(at);
    osc.stop(at + STEP * 1.6);
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
        this.burst(t, 0.018, 0.05, 5200);
        break;
      }
      case "click":
        this.blip("triangle", 520, 160, t, 0.09, 0.22);
        this.burst(t, 0.03, 0.12, 3200);
        break;
      case "tick":
        this.blip("square", 2400, 2400, t, 0.02, 0.05);
        break;
      case "boot":
        this.blip("sawtooth", 70, 880, t, 0.7, 0.12);
        [0, 0.12, 0.24].forEach((d, i) => this.blip("square", midi(69 + [0, 7, 12][i]), midi(69 + [0, 7, 12][i]), t + 0.55 + d, 0.18, 0.08));
        break;
      case "ban":
        this.blip("sawtooth", 190, 45, t, 0.4, 0.35);
        this.burst(t, 0.35, 0.3, 900);
        break;
      case "pick":
        [72, 76, 79, 84].forEach((n, i) => this.blip("square", midi(n), midi(n), t + i * 0.06, 0.09, 0.1));
        break;
      case "deny":
        this.blip("square", 150, 140, t, 0.09, 0.14);
        this.blip("square", 150, 110, t + 0.12, 0.12, 0.14);
        break;
      case "unlock":
        this.blip("triangle", midi(76), midi(76), t, 0.1, 0.2);
        this.blip("triangle", midi(83), midi(83), t + 0.09, 0.22, 0.2);
        break;
      case "success":
        [60, 64, 67, 72, 76].forEach((n, i) => this.blip("triangle", midi(n), midi(n), t + i * 0.07, 0.4, 0.12));
        break;
    }
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
