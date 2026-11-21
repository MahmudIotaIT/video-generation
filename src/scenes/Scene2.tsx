import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {SceneShell} from '../components/SceneShell';
import {LANE, Stage, Street} from '../components/city/Backdrop';
import {Rickshaw} from '../components/city/Rickshaw';
import {Bus, Car, Cng} from '../components/city/Vehicles';
import {Burst, ClockBadge, ThoughtBubble} from '../components/city/Props';
import {CLAMP, camera, ease} from '../lib/anim';
import {cueEnd, cueStart, hitsFor, isTalking} from '../data/fx';
import type {SceneTiming} from '../timeline';

/** Stuck between two buses: "সামনে বাস, পিছনে বাস, ডাইনে প্রাইভেট কার… আমি কি উড়াল দিমু?" */
export const Scene2: React.FC<{t: SceneTiming}> = ({t}) => {
  const f = useCurrentFrame();
  const d = t.duration;
  const hits = hitsFor(t);
  const [c0, c1, c2, c3] = [0, 1, 2, 3].map((i) => cueStart(t, i));
  const rTalk = isTalking(t, f, 'rumana');
  const kTalk = isTalking(t, f, 'karim');

  const carX = interpolate(f, [c2 - 20, c2 + 12], [1500, 760], {...CLAMP, easing: ease});
  const cam = camera(f, [
    {f: 0, x: 540, y: 820, s: 1.3},
    {f: c1 - 4, x: 540, y: 900, s: 1.0},
    {f: c1 + 18, x: 760, y: 900, s: 1.05},
    {f: c1 + 40, x: 330, y: 900, s: 1.05},
    {f: c2 + 4, x: 600, y: 1130, s: 0.98},
    {f: c3 - 2, x: 600, y: 1100, s: 0.98},
    {f: c3 + 14, x: 600, y: 760, s: 1.0},
    {f: d, x: 600, y: 740, s: 1.06},
  ]);
  const kPose = f >= c1 && f < cueEnd(t, 1) ? 'shrug' : f >= c3 ? 'shrug' : 'ride';

  return (
    <SceneShell t={t} vignette={0.3} {...cam} overlay={<ClockBadge minutes={8 * 60 + 41 + interpolate(f, [0, d], [0, 3], CLAMP)} label="সকাল" />}>
      <Stage>
        <Street id="s2" sky={['#79c7f7', '#b7e1ff', '#ffe9c9']} sun={{x: 260, y: 230}} />
        <Cng x={interpolate(f, [0, d], [260, 330])} y={1110} scale={0.6} roll={f * 2} />
        <Car x={interpolate(f, [0, d], [820, 860])} y={1115} scale={0.6} color="#f2c14e" roll={f} />
        <Bus x={-240} y={LANE - 16} scale={0.8} color="#d23c3c" stripe="#ffffff" route="গুলিস্তান — মিরপুর" seed="b2r" shake={hits.busHorn.some((h) => f >= h && f < h + 18) ? 1 : 0} />
        <Bus x={1330} y={LANE - 16} scale={0.8} seed="b2f" shake={hits.busHorn.some((h) => f >= h && f < h + 18) ? 1 : 0} />
        <Rickshaw
          idPrefix="s2r" x={545} y={LANE} scale={0.92} pedal={1}
          karim={{mood: f >= c3 ? 'smug' : f >= c1 ? 'calm' : 'calm', talking: kTalk, pose: kPose, look: f >= c1 ? -1 : 0}}
          rumana={{mood: 'hurry', talking: rTalk, pose: f < cueEnd(t, 0) + 6 ? 'hands' : 'sit', look: 1, fx: f >= c0 ? 'sweat' : null}}
        />
        <Car x={carX} y={1730} scale={1.15} color="#3a6fd0" shake={hits.carHorn.some((h) => f >= h && f < h + 10) ? 1 : 0} />
        {hits.busHorn.map((h, k) => <Burst key={`bh${h}`} x={k % 2 ? 160 : 930} y={k % 2 ? 860 : 820} text="প্যাঁ-পোঁ!" at={h} size={46} rot={k % 2 ? -10 : 10} />)}
        {hits.carHorn.map((h, k) => <Burst key={`ch${h}`} x={900} y={1380 - k * 40} text="পিপ!" at={h} size={44} color="#7fd3ff" />)}
        <ThoughtBubble x={720} y={300} tail={[720, 640]} w={520} h={330} at={c3 - 2} until={d - 2}>
          <g transform={`translate(10,${110 + Math.sin(f / 5) * 12}) rotate(-8)`}>
            <Rickshaw idPrefix="s2w" x={0} y={0} scale={0.3} wings={1} roll={f * 6} pedal={f * 0.3} karim={{mood: 'happy', talking: false}} rumana={{mood: 'happy', talking: false}} />
          </g>
          {[[-170, -70], [160, -90], [-120, 60]].map(([sx, sy], i) => (
            <path key={i} d="M 0 -14 L 4 -4 L 14 0 L 4 4 L 0 14 L -4 4 L -14 0 L -4 -4 Z" fill="#ffd35a" transform={`translate(${sx},${sy}) scale(${1 + 0.3 * Math.sin(f / 4 + i)})`} />
          ))}
        </ThoughtBubble>
        {hits.boing.map((h) => <Burst key={`bo${h}`} x={330} y={330} text="উড়াল?!" at={h} size={40} color="#ff7eb6" />)}
      </Stage>
    </SceneShell>
  );
};
