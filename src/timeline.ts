import {FPS, LEAD_IN, SCENES, TAIL, type Speaker} from './data/script';

/** start/end = subtitle visibility; speakStart/speakEnd = when the voice is actually talking. */
export type Cue = {text: string; who: Speaker; start: number; end: number; speakStart: number; speakEnd: number};
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
export type LineTimes = {start: number; end: number}[];

const weight = (s: string) => {
  const tr = s.trim();
  let w = tr.replace(/\s+/g, ' ').length;
  const last = tr.slice(-1);
  if ('।!?'.includes(last)) w += 6;
  else if (',—–-'.includes(last)) w += 3;
  return w;
};

/**
 * audioSeconds[i] = length of scene i's dialogue file (null = missing → estimate).
 * lineTimes[i] = exact line offsets from lines.json (null = spread lines by text length).
 */
export function buildTimeline(audioSeconds: (number | null | undefined)[], lineTimes: (LineTimes | null | undefined)[] = [], fps = FPS): Timeline {
  let cursor = 0;
  const scenes: SceneTiming[] = [];
  const all: Cue[] = [];
  SCENES.forEach((sc, i) => {
    const lead = sc.leadIn ?? LEAD_IN;
    const a = audioSeconds[i];
    const hasAudio = typeof a === 'number' && a > 0;
    const narrSec = hasAudio ? (a as number) : sc.minSeconds - lead - TAIL - 0.3;
    const durSec = Math.max(sc.minSeconds, lead + narrSec + TAIL);
    const duration = Math.round(durSec * fps);
    const narrationStart = Math.round(lead * fps);
    const narrationFrames = Math.round(narrSec * fps);

    const exact = lineTimes[i];
    let spans: [number, number][];
    if (hasAudio && exact && exact.length === sc.lines.length) {
      spans = exact.map((l) => [narrationStart + Math.round(l.start * fps), narrationStart + Math.round(l.end * fps)]);
    } else {
      const weights = sc.lines.map((l) => weight(l.text));
      const totalW = weights.reduce((x, y) => x + y, 0);
      let acc = 0;
      spans = weights.map((w) => {
        const s = narrationStart + Math.round((acc / totalW) * narrationFrames);
        acc += w;
        return [s, narrationStart + Math.round((acc / totalW) * narrationFrames) - 4];
      });
    }

    const cues: Cue[] = sc.lines.map((l, k) => {
      const [speakStart, speakEnd] = spans[k];
      const last = k === sc.lines.length - 1;
      const end = last ? Math.min(duration - 2, speakEnd + 12) : Math.max(speakEnd + 2, spans[k + 1][0]);
      return {text: l.text, who: l.who, start: speakStart, end, speakStart, speakEnd};
    });
    scenes.push({index: i, from: cursor, duration, narrationStart, narrationFrames, hasAudio, cues});
    cues.forEach((c) =>
      all.push({...c, start: c.start + cursor, end: c.end + cursor, speakStart: c.speakStart + cursor, speakEnd: c.speakEnd + cursor}),
    );
    cursor += duration;
  });
  return {fps, total: cursor, scenes, cues: all};
}
