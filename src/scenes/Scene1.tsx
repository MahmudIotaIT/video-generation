import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {SceneShell} from '../components/SceneShell';
import {LANE, Stage, Street} from '../components/city/Backdrop';
import {Rickshaw, RumanaStanding} from '../components/city/Rickshaw';
import {Car} from '../components/city/Vehicles';
import {Burst, ClockBadge} from '../components/city/Props';
import {TitleText} from '../components/Overlays';
import {CLAMP, camera} from '../lib/anim';
import {cueStart, hitsFor, isTalking} from '../data/fx';
import type {SceneTiming} from '../timeline';

export const Scene1: React.FC<{t: SceneTiming}> = ({t}) => {
  const f = useCurrentFrame();
  const d = t.duration;
  const hits = hitsFor(t);
  const c1 = cueStart(t, 1);
  const c2 = cueStart(t, 2);
  const c3 = cueStart(t, 3);
  const rTalk = isTalking(t, f, 'rumana');
  const kTalk = isTalking(t, f, 'karim');

  // A car drives past in the back lane and honks.
  const carX = interpolate(f, [0, d], [-500, 1500]);
  const cam = camera(f, [
    {f: 0, x: 540, y: 900, s: 1.12},
    {f: c1, x: 500, y: 960, s: 1.0},
    {f: c3 - 6, x: 520, y: 960, s: 1.0},
    {f: c3 + 10, x: 860, y: 880, s: 1.45},
    {f: d, x: 865, y: 885, s: 1.5},
  ]);
  const titleOut = c2 - 4;

  return (
    <SceneShell t={t} vignette={0.35} {...cam} fadeIn={0} overlay={
      <>
        <ClockBadge minutes={8 * 60 + 30 + interpolate(f, [0, d], [0, 4], CLAMP)} label="সকাল" appearAt={4} />
        <TitleText text="মিশন: নয়টার মিটিং!" appearAt={c1} until={titleOut} top={330} size={88} color="#fff6d6" glow="rgba(255,90,122,0.85)" />
      </>
    }>
      <Stage>
        <Street id="s1" sky={['#6ec6ff', '#a8dcff', '#ffe6c2']} sun={{x: 210, y: 300}} scroll={0} />
        <Car x={carX} y={1120} scale={0.62} color="#3a6fd0" roll={f * 9} />
        <Rickshaw
          idPrefix="s1r" x={690} y={LANE} scale={0.95}
          karim={{mood: f >= c3 ? 'smug' : 'calm', talking: kTalk, pose: f >= c2 && f < c3 ? 'wave' : 'ride', look: -1}}
          rumana={null}
        />
        <RumanaStanding x={210} y={LANE + 10} scale={0.95} mood={f >= c3 ? 'shock' : 'hurry'} talking={rTalk} pose={f < c1 ? 'wave' : f < c2 ? 'watch' : 'idle'} look={1} />
        {hits.bell.map((h) => <Burst key={`b${h}`} x={880} y={820} text="ক্রিং ক্রিং!" at={h} size={44} rot={8} />)}
        {hits.carHorn.map((h) => <Burst key={`c${h}`} x={carX + 120} y={880} text="পিপ পিপ!" at={h} size={40} color="#7fd3ff" />)}
      </Stage>
    </SceneShell>
  );
};
