import type {SceneTiming} from '../timeline';

export const cueStart = (t: SceneTiming, i: number) => t.cues[Math.min(Math.max(i, 0), t.cues.length - 1)]?.start ?? 0;
export const cueEnd = (t: SceneTiming, i: number) => t.cues[Math.min(Math.max(i, 0), t.cues.length - 1)]?.end ?? t.duration;

export const strikesFor = (t: SceneTiming): number[] => {
  const d = t.duration;
  switch (t.index) {
    case 0:
      return [0.12, 0.45, 0.8].map((x) => Math.round(d * x));
    case 3: {
      const s = cueStart(t, 2);
      const w = cueStart(t, 3);
      return [s + 4, s + 26, w + 12, w + 30];
    }
    case 5:
      return [Math.round(d * 0.28)];
    default:
      return [];
  }
};

export const radarPings = (t: SceneTiming): number[] => {
  if (t.index !== 2) return [];
  const out: number[] = [];
  for (let f = cueStart(t, 3); f < cueStart(t, 4); f += 30) out.push(f);
  return out;
};
