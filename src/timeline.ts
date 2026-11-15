import {FPS, LEAD_IN, SCENES, TAIL} from './data/script';

export type Cue = {text: string; start: number; end: number};
export type SceneTiming = {
  index: number;
  from: number;
  duration: number;
  narrationStart: number;
  narrationFrames: number;
  hasAudio: boolean;
  cues: Cue[];
};
export type Timeline = {fps: number; total: number; scenes: SceneTiming[]; cues: Cue[]};

const weight = (s: string) => {
  const tr = s.trim();
  let w = tr.replace(/\s+/g, ' ').length;
  const last = tr.slice(-1);
  if ('।!?'.includes(last)) w += 6;
  else if (',—–-'.includes(last)) w += 3;
  return w;
};

export function buildTimeline(audioSeconds: (number | null | undefined)[], fps = FPS): Timeline {
  let cursor = 0;
  const scenes: SceneTiming[] = [];
  const all: Cue[] = [];
  SCENES.forEach((sc, i) => {
    const a = audioSeconds[i];
    const hasAudio = typeof a === 'number' && a > 0;
    const narrSec = hasAudio ? (a as number) : sc.minSeconds - LEAD_IN - TAIL - 0.3;
    const durSec = Math.max(sc.minSeconds, LEAD_IN + narrSec + TAIL);
    const duration = Math.round(durSec * fps);
    const narrationStart = Math.round(LEAD_IN * fps);
    const narrationFrames = Math.round(narrSec * fps);
    const weights = sc.chunks.map(weight);
    const totalW = weights.reduce((x, y) => x + y, 0);
    let acc = 0;
    const cues: Cue[] = sc.chunks.map((text, k) => {
      const start = narrationStart + Math.round((acc / totalW) * narrationFrames);
      acc += weights[k];
      const end =
        k === sc.chunks.length - 1
          ? Math.min(duration - 2, narrationStart + narrationFrames + 9)
          : narrationStart + Math.round((acc / totalW) * narrationFrames);
      return {text, start, end};
    });
    scenes.push({index: i, from: cursor, duration, narrationStart, narrationFrames, hasAudio, cues});
    cues.forEach((c) => all.push({text: c.text, start: c.start + cursor, end: c.end + cursor}));
    cursor += duration;
  });
  return {fps, total: cursor, scenes, cues: all};
}
