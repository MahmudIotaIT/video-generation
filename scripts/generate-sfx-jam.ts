/**
 * Synthesises the funny music bed + comic SFX for the Dhaka jam video (original, deterministic).
 * Output: public/audio/jam/*.mp3. Existing files are kept unless FORCE=1.
 */
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const SR = 44100;
const DIR = 'public/audio/jam';
const FORCE = process.env.FORCE === '1';
fs.mkdirSync(DIR, {recursive: true});
fs.mkdirSync('.tmp', {recursive: true});

const TAU = Math.PI * 2;
const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

type Stereo = {L: Float32Array; R: Float32Array};
const make = (sec: number): Stereo => ({L: new Float32Array(Math.ceil(sec * SR)), R: new Float32Array(Math.ceil(sec * SR))});

/** Add a mono signal at time t0 with pan (-1..1). */
const add = (buf: Stereo, t0: number, sig: Float32Array, gain = 1, pan = 0) => {
  const s0 = Math.round(t0 * SR);
  const gl = gain * Math.sqrt((1 - pan) / 2) * Math.SQRT2;
  const gr = gain * Math.sqrt((1 + pan) / 2) * Math.SQRT2;
  for (let i = 0; i < sig.length; i++) {
    const j = s0 + i;
    if (j < 0 || j >= buf.L.length) continue;
    buf.L[j] += sig[i] * gl;
    buf.R[j] += sig[i] * gr;
  }
};

const synth = (sec: number, fn: (t: number, i: number) => number) => {
  const out = new Float32Array(Math.ceil(sec * SR));
  for (let i = 0; i < out.length; i++) out[i] = fn(i / SR, i);
  return out;
};

const lowpass = (x: Float32Array, cutoff: number) => {
  const a = 1 - Math.exp((-TAU * cutoff) / SR);
  let y = 0;
  for (let i = 0; i < x.length; i++) x[i] = y += a * (x[i] - y);
  return x;
};

const save = (name: string, buf: Stereo, peak = 0.89, fadeIn = 0.003, fadeOut = 0.02) => {
  const file = path.join(DIR, name);
  if (fs.existsSync(file) && !FORCE) {
    console.log(`↷ exists, skipped: ${file}`);
    return;
  }
  const n = buf.L.length;
  let m = 1e-9;
  for (let i = 0; i < n; i++) m = Math.max(m, Math.abs(buf.L[i]), Math.abs(buf.R[i]));
  const pcm = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const env = Math.min(1, t / fadeIn, (n / SR - t) / fadeOut);
    const g = (peak / m) * Math.max(0, env);
    pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, buf.L[i] * g)) * 32767), i * 4);
    pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, buf.R[i] * g)) * 32767), i * 4 + 2);
  }
  const raw = path.join('.tmp', name + '.raw');
  fs.writeFileSync(raw, pcm);
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 's16le', '-ar', String(SR), '-ac', '2', '-i', raw, '-ar', String(SR), '-c:a', 'libmp3lame', '-q:a', '3', file]);
  console.log(`✓ ${file}`);
};

const mono = (sig: Float32Array): Stereo => ({L: sig, R: Float32Array.from(sig)});

// ---------- instruments ----------
const pluck = (f: number, dur: number, seed: number, bright = 0.5) => {
  const r = rng(seed);
  const N = Math.max(2, Math.round(SR / f));
  const ring = new Float32Array(N).map(() => r() * 2 - 1);
  const out = new Float32Array(Math.ceil(dur * SR));
  let idx = 0;
  for (let i = 0; i < out.length; i++) {
    const a = ring[idx];
    const b = ring[(idx + 1) % N];
    ring[idx] = (a * bright + b * (1 - bright)) * 0.996;
    out[i] = a;
    idx = (idx + 1) % N;
  }
  return out;
};
const marimba = (f: number, dur: number) =>
  synth(dur, (t) => Math.sin(TAU * f * t) * Math.exp(-t * 7) + 0.3 * Math.sin(TAU * f * 4 * t) * Math.exp(-t * 28) + 0.15 * Math.sin(TAU * f * 10 * t) * Math.exp(-t * 60));
const bass = (f: number, dur: number) =>
  synth(dur, (t) => {
    const e = Math.min(1, t / 0.006) * Math.exp(-t * 4.5);
    return e * (Math.sin(TAU * f * t) + 0.35 * Math.sin(TAU * 2 * f * t) + 0.12 * Math.sin(TAU * 3 * f * t));
  });
const noiseHit = (dur: number, seed: number, decay: number, cutoff: number) => {
  const r = rng(seed);
  const x = synth(dur, (t) => (r() * 2 - 1) * Math.exp(-t * decay));
  // crude highpass: subtract lowpassed copy
  const lp = lowpass(Float32Array.from(x), cutoff);
  return x.map((v, i) => v - lp[i]);
};

// ---------- music: bouncy "oom-pah" comedy loop, 124 bpm ----------
const music = () => {
  const BPM = 124;
  const beat = 60 / BPM;
  const bars = 52; // ~100 s
  const buf = make(bars * 4 * beat + 2);
  // I – V – vi – IV in C, last bar of each 8 is a cheeky turnaround (IV – V)
  const prog = [
    [48, [60, 64, 67]],
    [43, [59, 62, 67]],
    [45, [60, 64, 69]],
    [41, [60, 65, 69]],
  ] as const;
  const scale = [72, 74, 76, 79, 81, 84];
  for (let b = 0; b < bars; b++) {
    const t0 = b * 4 * beat;
    const [root, chord] = prog[b % 4];
    // oom (bass) on 1 and 3, fifth on 3
    add(buf, t0, bass(midi(root), beat * 1.6), 0.55);
    add(buf, t0 + 2 * beat, bass(midi(root + 7 > 52 ? root - 5 : root + 7), beat * 1.6), 0.5);
    // pah (pluck chord) on 2 and 4
    for (const off of [1, 3]) chord.forEach((n, k) => add(buf, t0 + off * beat + k * 0.012, pluck(midi(n), beat * 0.9, b * 31 + off * 7 + k, 0.45), 0.13, k - 1));
    // shaker on 8ths
    for (let e = 0; e < 8; e++) add(buf, t0 + e * beat * 0.5, noiseHit(0.06, b * 97 + e, 70, 3000), e % 2 ? 0.05 : 0.03, 0.5);
    // soft kick on 1
    add(buf, t0, synth(0.25, (t) => Math.sin(TAU * (50 + 90 * Math.exp(-t * 30)) * t) * Math.exp(-t * 14)), 0.35);
    // marimba melody (skip first 2 bars so the intro is light), phrase repeats every 4 bars
    if (b >= 2) {
      const r = rng(1000 + (b % 4) * 13 + (b % 8 >= 4 ? 5 : 0));
      for (let e = 0; e < 8; e++) {
        if (r() < 0.38) continue;
        const near = chord[Math.floor(r() * 3)] + 12;
        const n = r() < 0.6 ? near : scale[Math.floor(r() * scale.length)];
        add(buf, t0 + e * beat * 0.5, marimba(midi(n), 0.6), 0.22, r() * 0.6 - 0.3);
      }
    }
  }
  save('music.mp3', buf, 0.85, 1.5, 4);
};

// ---------- traffic ambience (25 s) ----------
const traffic = () => {
  const dur = 25;
  const r = rng(7);
  const rumble = lowpass(synth(dur, () => r() * 2 - 1), 180).map((v, i) => v * 6 * (0.75 + 0.25 * Math.sin((TAU * i) / SR / 3.7)));
  const hiss = lowpass(synth(dur, () => r() * 2 - 1), 1500).map((v, i) => v * 0.35 * (0.6 + 0.4 * Math.sin((TAU * i) / SR / 5.3 + 1)));
  const buf = mono(rumble.map((v, i) => v + hiss[i]));
  // distant horns & bells
  for (let k = 0; k < 16; k++) {
    const t0 = 0.5 + r() * (dur - 2);
    const f = 300 + r() * 450;
    const len = 0.12 + r() * 0.4;
    const reps = r() < 0.5 ? 1 : 2;
    for (let q = 0; q < reps; q++) {
      const horn = lowpass(synth(len, (t) => Math.sign(Math.sin(TAU * f * t)) * Math.min(1, t / 0.01, (len - t) / 0.03)), 1400);
      add(buf, t0 + q * (len + 0.08), horn, 0.05 + r() * 0.05, r() * 1.6 - 0.8);
    }
  }
  save('traffic.mp3', buf, 0.7, 1.0, 1.0);
};

// ---------- horns ----------
const hornTone = (freqs: number[], len: number, bend = 0) =>
  synth(len, (t) => {
    const env = Math.min(1, t / 0.015, (len - t) / 0.04);
    let v = 0;
    for (const f0 of freqs) {
      const f = f0 * (1 - bend * Math.exp(-t * 25));
      for (let h = 1; h <= 10; h++) v += Math.sin(TAU * f * h * t) / h;
    }
    return env * Math.tanh(v * 0.9);
  });
const busHorn = () => {
  const buf = make(1.3);
  add(buf, 0, hornTone([311, 392], 0.16, 0.08), 0.8);
  add(buf, 0.24, hornTone([311, 392], 0.95, 0.05), 1);
  save('horn-bus.mp3', buf);
};
const carHorn = () => {
  const buf = make(0.7);
  add(buf, 0, hornTone([440, 554], 0.17), 1);
  add(buf, 0.27, hornTone([440, 554], 0.22), 1);
  save('horn-car.mp3', buf);
};

// ---------- rickshaw bell: rattling "kring-kring" ----------
const bell = () => {
  const buf = make(1.6);
  const partials = [1, 2.31, 3.9, 5.2];
  const strike = synth(0.5, (t) => partials.reduce((v, p, k) => v + Math.sin(TAU * 1850 * p * t) * Math.exp(-t * (9 + k * 6)) / (k + 1), 0));
  for (const burst of [0, 0.5]) for (let s = 0; s < 9; s++) add(buf, burst + s * 0.034, strike, 0.35 * (1 - s * 0.06));
  save('bell.mp3', buf);
};

// ---------- comic ----------
const boing = () =>
  save('boing.mp3', mono(synth(0.9, (t) => {
    const f = 150 * (1 + 0.6 * Math.exp(-t * 7)) * (1 + 0.12 * Math.sin(TAU * 13 * t) * Math.exp(-t * 2));
    return Math.sin(TAU * f * t + 0.6 * Math.sin(TAU * 2 * f * t)) * Math.min(1, t / 0.005) * Math.exp(-t * 3.2);
  })));

const pop = () => {
  let ph = 0;
  save('pop.mp3', mono(synth(0.12, (t) => {
    ph += (TAU * (1100 * Math.exp(-t * 30) + 250)) / SR;
    return Math.sin(ph) * Math.exp(-t * 35);
  })));
};

const slide = () => {
  let ph = 0;
  const r = rng(3);
  save('slide.mp3', mono(synth(1.0, (t) => {
    const f = (450 + 1400 * Math.pow(t / 1.0, 1.4)) * (1 + 0.015 * Math.sin(TAU * 6 * t));
    ph += (TAU * f) / SR;
    return (Math.sin(ph) + 0.05 * (r() * 2 - 1)) * Math.min(1, t / 0.05);
  })), 0.8, 0.01, 0.08);
};

const phone = () => {
  const buf = make(2.0);
  const ring = synth(0.75, (t) => {
    const gate = Math.sin(TAU * 18 * t) > 0 ? 1 : 0.15;
    return gate * (Math.sin(TAU * 1250 * t) + 0.8 * Math.sin(TAU * 1560 * t)) * Math.min(1, t / 0.01, (0.75 - t) / 0.02);
  });
  add(buf, 0, ring, 0.6);
  add(buf, 1.05, ring, 0.6);
  save('phone.mp3', buf);
};

const trombone = () => {
  const notes: [number, number][] = [[196, 0.42], [185, 0.42], [174.6, 0.42], [164.8, 1.4]];
  let t0 = 0;
  const buf = make(3.2);
  notes.forEach(([f, len], k) => {
    const last = k === notes.length - 1;
    add(buf, t0, synth(len, (t) => {
      const vib = last ? 1 + 0.03 * Math.sin(TAU * 5.5 * t) * Math.min(1, t / 0.3) : 1;
      const wah = Math.min(1, t / 0.12) * (last ? Math.exp(-t * 0.8) : 1);
      let v = 0;
      for (let h = 1; h <= 12; h++) v += (Math.sin(TAU * f * vib * h * t) / h) * Math.pow(wah, h * 0.35);
      return v * Math.min(1, t / 0.03, (len - t) / 0.06);
    }), 0.6);
    t0 += len + 0.04;
  });
  save('trombone.mp3', buf);
};

const ticks = () => {
  const buf = make(3.2);
  for (let k = 0; k < 26; k++) add(buf, k * 0.12, synth(0.03, (t) => Math.sin(TAU * (k % 2 ? 2600 : 3200) * t) * Math.exp(-t * 180)), 0.8);
  save('ticks.mp3', buf);
};

music();
traffic();
busHorn();
carHorn();
bell();
boing();
pop();
slide();
phone();
trombone();
ticks();
fs.rmSync('.tmp', {recursive: true, force: true});
console.log('🎵 Music + SFX ready → public/audio/jam/');
