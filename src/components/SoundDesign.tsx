import React from 'react';
import {Audio, Sequence, interpolate, staticFile} from 'remotion';
import {CLAMP} from '../lib/anim';
import {SFX, narrationFile} from '../data/script';
import {hitsFor, type Hits} from '../data/fx';
import type {Timeline} from '../timeline';

const bed = (dur: number, v: number) => (f: number) => v * interpolate(f, [0, 15, dur - 15, dur], [0, 1, 1, 0], CLAMP);

// Per-hit-type: file, volume, max length in frames.
const HIT_SFX: Record<keyof Hits, {src: string; vol: number; len: number}> = {
  busHorn: {src: SFX.busHorn, vol: 0.5, len: 45},
  carHorn: {src: SFX.carHorn, vol: 0.45, len: 25},
  bell: {src: SFX.bell, vol: 0.55, len: 50},
  boing: {src: SFX.boing, vol: 0.6, len: 30},
  pop: {src: SFX.pop, vol: 0.5, len: 8},
  slide: {src: SFX.slide, vol: 0.45, len: 32},
  phone: {src: SFX.phone, vol: 0.5, len: 60},
  trombone: {src: SFX.trombone, vol: 0.6, len: 95},
  ticks: {src: SFX.ticks, vol: 0.45, len: 40},
};

export const SoundDesign: React.FC<{timeline: Timeline; assets: Record<string, boolean>}> = ({timeline, assets}) => {
  const has = (p: string) => !!assets[p];
  const S = timeline.scenes;
  const speech = timeline.cues.map((c) => [c.speakStart, c.speakEnd] as const);

  const musicVolume = (f: number) => {
    let duck = 0;
    for (const [a, b] of speech) duck = Math.max(duck, interpolate(f, [a - 8, a, b, b + 12], [0, 1, 1, 0], CLAMP));
    const fadeIn = interpolate(f, [0, 20], [0, 1], CLAMP);
    const fadeOut = interpolate(f, [timeline.total - 50, timeline.total], [1, 0], CLAMP);
    return (0.3 - duck * 0.17) * fadeIn * fadeOut;
  };

  // Traffic ambience per scene (quieter on the phone call and at the closed office).
  const trafficVol = [0.22, 0.32, 0.25, 0.22, 0.12, 0.14];

  return (
    <>
      {has(SFX.music) && <Audio src={staticFile(SFX.music)} loop volume={musicVolume} />}
      {S.map((s, i) =>
        has(narrationFile(i)) ? (
          <Sequence key={`n${i}`} from={s.from + s.narrationStart} name={`Dialogue ${i + 1}`}>
            <Audio src={staticFile(narrationFile(i))} />
          </Sequence>
        ) : null,
      )}
      {has(SFX.traffic) &&
        S.map((s, i) => (
          <Sequence key={`tr${i}`} from={s.from} durationInFrames={s.duration} name={`Traffic ${i + 1}`}>
            <Audio src={staticFile(SFX.traffic)} loop volume={bed(s.duration, trafficVol[i] ?? 0.2)} />
          </Sequence>
        ))}
      {S.flatMap((s) => {
        const h = hitsFor(s);
        return (Object.keys(h) as (keyof Hits)[]).flatMap((k) =>
          has(HIT_SFX[k].src)
            ? h[k].map((at, j) => (
                <Sequence key={`${k}${s.index}-${j}`} from={Math.max(0, s.from + at)} durationInFrames={HIT_SFX[k].len} name={`${k} ${s.index + 1}`}>
                  <Audio src={staticFile(HIT_SFX[k].src)} volume={HIT_SFX[k].vol} />
                </Sequence>
              ))
            : [],
        );
      })}
      {has(SFX.whoosh) &&
        S.slice(1).map((s) => (
          <Sequence key={`wh${s.index}`} from={Math.max(0, s.from - 10)} durationInFrames={40} name="Whoosh">
            <Audio src={staticFile(SFX.whoosh)} volume={0.35} />
          </Sequence>
        ))}
    </>
  );
};
