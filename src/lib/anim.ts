import {Easing, interpolate} from 'remotion';

export const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = Easing.inOut(Easing.cubic);

export const ramp = (f: number, a: number, b: number, from = 0, to = 1, easing: (n: number) => number = ease): number => {
  if (b <= a) return f >= a ? to : from;
  return interpolate(f, [a, b], [from, to], {...CLAMP, easing});
};

export const windowed = (f: number, start: number, end: number, fin = 10, fout = 10) =>
  Math.max(0, Math.min(ramp(f, start, start + fin), 1 - ramp(f, end - fout, end)));

export const mono = (arr: number[]) => {
  const out = [...arr];
  for (let i = 1; i < out.length; i++) if (out[i] <= out[i - 1]) out[i] = out[i - 1] + 1;
  return out;
};

export function wavePath(o: {width: number; baseY: number; amp: number; length: number; phase: number; bottom: number; step?: number}) {
  const step = o.step ?? 24;
  let d = `M ${-step} ${o.bottom}`;
  for (let x = -step; x <= o.width + step; x += step) {
    const y =
      o.baseY +
      Math.sin((x / o.length) * Math.PI * 2 + o.phase) * o.amp +
      Math.sin((x / (o.length * 0.47)) * Math.PI * 2 - o.phase * 1.3) * o.amp * 0.35;
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  d += ` L ${o.width + step} ${o.bottom} Z`;
  return d;
}

export const flashIntensity = (f: number, strikes: number[]) => {
  let v = 0;
  for (const s of strikes) {
    const dt = f - s;
    if (dt < 0 || dt > 24) continue;
    const flick = dt < 2 ? 1 : dt < 4 ? 0.35 : dt < 6 ? 0.85 : 1;
    v = Math.max(v, Math.exp(-dt / 5) * flick);
  }
  return v;
};

export function pointOnPolyline(pts: [number, number][], t: number): [number, number] {
  const seg: number[] = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    seg.push(l);
    total += l;
  }
  let target = Math.max(0, Math.min(1, t)) * total;
  for (let i = 0; i < seg.length; i++) {
    if (target <= seg[i]) {
      const k = seg[i] === 0 ? 0 : target / seg[i];
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
    }
    target -= seg[i];
  }
  return pts[pts.length - 1];
}
