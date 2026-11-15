import React from 'react';
import {Audio, Sequence, interpolate, staticFile} from 'remotion';
import {CLAMP} from '../lib/anim';
import {SFX, narrationFile} from '../data/script';
import {cueStart, radarPings, strikesFor} from '../data/fx';
import type {Timeline} from '../timeline';

const bed = (dur: number, v: number) => (f: number) => v * interpolate(f, [0, 15, dur - 15, dur], [0, 1, 1, 0], CLAMP);

export const SoundDesign: React.FC<{timeline: Timeline; assets: Record<string, boolean>}> = ({timeline, assets}) => {
  const has = (p: string) => !!assets[p];
  const S = timeline.scenes;
  const narr = S.map((s) => [s.from + s.narrationStart, s.from + s.narrationStart + s.narrationFrames] as const);

  const musicVolume = (f: number) => {
    let duck = 0;
    for (const [a, b] of narr) duck = Math.max(duck, interpolate(f, [a - 10, a, b, b + 15], [0, 1, 1, 0], CLAMP));
    const fadeIn = interpolate(f, [0, 30], [0, 1], CLAMP);
    const fadeOut = interpolate(f, [timeline.total - 60, timeline.total], [1, 0], CLAMP);
    return (0.32 - duck * 0.19) * fadeIn * fadeOut;
  };

  const oceanVol = [0.5, 0, 0.3, 0.55, 0.35, 0.4];
  const windVol = [0.35, 0, 0, 0.4, 0, 0.25];

  return (
    <>
      {has(SFX.music) && <Audio src={staticFile(SFX.music)} loop volume={musicVolume} />}
      {S.map((s, i) =>
        has(narrationFile(i)) ? (
          <Sequence key={`n${i}`} from={s.from + s.narrationStart} name={`Narration ${i + 1}`}>
            <Audio src={staticFile(narrationFile(i))} />
          </Sequence>
        ) : null,
      )}
      {has(SFX.ocean) &&
        S.map((s, i) =>
          oceanVol[i] > 0 ? (
            <Sequence key={`o${i}`} from={s.from} durationInFrames={s.duration} name={`Ocean ${i + 1}`}>
              <Audio src={staticFile(SFX.ocean)} loop volume={bed(s.duration, oceanVol[i])} />
            </Sequence>
          ) : null,
        )}
      {has(SFX.wind) &&
        S.map((s, i) =>
          windVol[i] > 0 ? (
            <Sequence key={`w${i}`} from={s.from} durationInFrames={s.duration} name={`Wind ${i + 1}`}>
              <Audio src={staticFile(SFX.wind)} loop volume={bed(s.duration, windVol[i])} />
            </Sequence>
          ) : null,
        )}
      {has(SFX.thunder) &&
        S.flatMap((s) =>
          strikesFor(s).map((st, k) => (
            <Sequence key={`t${s.index}-${k}`} from={s.from + st + 5} durationInFrames={150} name="Thunder">
              <Audio src={staticFile(SFX.thunder)} volume={s.index === 5 ? 0.35 : 0.75} />
            </Sequence>
          )),
        )}
      {has(SFX.radar) &&
        S.flatMap((s) =>
          radarPings(s).map((p, k) => (
            <Sequence key={`r${k}`} from={s.from + p} durationInFrames={45} name="Radar ping">
              <Audio src={staticFile(SFX.radar)} volume={0.55} />
            </Sequence>
          )),
        )}
      {has(SFX.whoosh) &&
        S.slice(1).map((s) => (
          <Sequence key={`wh${s.index}`} from={Math.max(0, s.from - 10)} durationInFrames={40} name="Whoosh">
            <Audio src={staticFile(SFX.whoosh)} volume={0.5} />
          </Sequence>
        ))}
      {has(SFX.riser) && S[2] && (
        <Sequence from={Math.max(0, S[2].from + cueStart(S[2], 3) - 110)} durationInFrames={125} name="Riser (radar)">
          <Audio src={staticFile(SFX.riser)} volume={0.45} />
        </Sequence>
      )}
      {has(SFX.riser) && S[5] && (
        <Sequence from={Math.max(0, S[5].from + cueStart(S[5], 2) - 110)} durationInFrames={125} name="Riser (ending)">
          <Audio src={staticFile(SFX.riser)} volume={0.4} />
        </Sequence>
      )}
    </>
  );
};
