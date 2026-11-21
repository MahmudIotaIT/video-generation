import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {SceneShell} from '../components/SceneShell';
import {LANE, Stage, Street} from '../components/city/Backdrop';
import {Rickshaw} from '../components/city/Rickshaw';
import {Bus} from '../components/city/Vehicles';
import {Burst, ClockBadge, Snail} from '../components/city/Props';
import {CLAMP, camera, mono} from '../lib/anim';
import {cueStart, hitsFor, isTalking} from '../data/fx';
import type {SceneTiming} from '../timeline';

/** A snail in a racing helmet overtakes the rickshaw. */
export const Scene4: React.FC<{t: SceneTiming}> = ({t}) => {
  const f = useCurrentFrame();
  const d = t.duration;
  const hits = hitsFor(t);
  const [c0, c1, c2] = [0, 1, 2].map((i) => cueStart(t, i));
  const rTalk = isTalking(t, f, 'rumana');
  const kTalk = isTalking(t, f, 'karim');

  const snailX = interpolate(f, mono([0, c0, c1, c1 + 45, d]), [-260, 330, 520, 1000, 1350], CLAMP);
  const camX = Math.max(380, Math.min(760, snailX));
  const cam = camera(f, [
    {f: 0, x: 540, y: 900, s: 1.0},
    {f: c0, x: 450, y: 1000, s: 1.2},
    {f: c1 + 45, x: 760, y: 1000, s: 1.2},
    {f: c2 - 4, x: 600, y: 900, s: 1.0},
    {f: d, x: 560, y: 880, s: 1.08},
  ]);
  // follow the snail while it overtakes
  const follow = f >= c0 && f <= c1 + 45 ? {x: -(camX - 540) * cam.scale} : {};

  return (
    <SceneShell t={t} vignette={0.3} {...cam} {...follow} overlay={<ClockBadge minutes={12 * 60 + 40 + interpolate(f, [0, d], [0, 2], CLAMP)} label="দুপুর" danger />}>
      <Stage>
        <Street id="s4" sky={['#3aa6f0', '#8fd0ff', '#fff4cf']} sun={{x: 640, y: 170}} />
        <Bus x={-250} y={LANE - 16} scale={0.8} color="#d23c3c" stripe="#ffffff" route="গুলিস্তান — মিরপুর" seed="b4r" />
        <Bus x={1330} y={LANE - 16} scale={0.8} seed="b4f" />
        <Rickshaw
          idPrefix="s4r" x={545} y={LANE} scale={0.92} pedal={1}
          karim={{mood: f >= c0 && f < c2 ? 'shock' : 'calm', talking: kTalk, pose: f >= c0 && f < c2 ? 'point' : 'ride', look: 1}}
          rumana={{mood: f >= c2 ? 'smug' : f >= c0 ? 'shock' : 'hurry', talking: rTalk, pose: f >= c2 ? 'point' : 'sit', look: 1}}
        />
        <Snail x={snailX} y={LANE + 25} scale={1.05} />
        {hits.pop.map((h) => <Burst key={`p${h}`} x={830} y={420} text="আরে!" at={h} size={44} />)}
        {hits.slide.map((h) => <Burst key={`s${h}`} x={snailX + 60} y={1040} text="ভোঁওও!" at={h + 6} size={42} color="#a3f07a" life={34} />)}
        {hits.carHorn.map((h) => <Burst key={`c${h}`} x={930} y={820} text="পিপ!" at={h} size={40} color="#7fd3ff" />)}
      </Stage>
    </SceneShell>
  );
};
