import type {Speaker} from './script';
import type {SceneTiming} from '../timeline';

const clampIdx = (t: SceneTiming, i: number) => Math.min(Math.max(i, 0), t.cues.length - 1);

/** Frame (scene-local) where line i starts being spoken. */
export const cueStart = (t: SceneTiming, i: number) => t.cues[clampIdx(t, i)]?.speakStart ?? 0;
/** Frame (scene-local) where line i stops being spoken. */
export const cueEnd = (t: SceneTiming, i: number) => t.cues[clampIdx(t, i)]?.speakEnd ?? t.duration;

/** True while `who` is speaking at scene-local frame f (drives mouth animation). */
export const isTalking = (t: SceneTiming, f: number, who: Speaker) =>
  t.cues.some((c) => c.who === who && f >= c.speakStart && f < c.speakEnd);

/** Scene-local frames where SFX hits happen. Shared by scenes (visual pops) and SoundDesign (audio). */
export type Hits = {busHorn: number[]; carHorn: number[]; bell: number[]; boing: number[]; pop: number[]; slide: number[]; phone: number[]; trombone: number[]; ticks: number[]};

export const hitsFor = (t: SceneTiming): Hits => {
  const h: Hits = {busHorn: [], carHorn: [], bell: [], boing: [], pop: [], slide: [], phone: [], trombone: [], ticks: []};
  const c = (i: number) => cueStart(t, i);
  const e = (i: number) => cueEnd(t, i);
  switch (t.index) {
    case 0:
      h.bell.push(2, e(3) + 4);
      h.carHorn.push(Math.round(t.duration * 0.35));
      h.pop.push(c(1));
      break;
    case 1:
      h.busHorn.push(4, c(1) + 6, c(1) + 30);
      h.carHorn.push(c(2) + 4, c(2) + 16);
      h.boing.push(c(3) + 10);
      break;
    case 2:
      h.ticks.push(0);
      h.pop.push(c(0) - 6);
      h.boing.push(c(3) + 2);
      break;
    case 3:
      h.slide.push(c(1) - 4);
      h.pop.push(c(0));
      h.carHorn.push(Math.round(t.duration * 0.88));
      break;
    case 4:
      h.phone.push(4);
      h.pop.push(c(0), c(2) + 4);
      break;
    case 5:
      h.bell.push(4);
      h.trombone.push(e(1) + 4);
      h.boing.push(c(3) + 8);
      h.pop.push(c(4));
      break;
  }
  return h;
};
