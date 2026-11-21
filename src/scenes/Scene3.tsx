import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {SceneShell} from '../components/SceneShell';
import {LANE, Stage, Street} from '../components/city/Backdrop';
import {Rickshaw} from '../components/city/Rickshaw';
import {Bus} from '../components/city/Vehicles';
import {Burst, ClockBadge, Vendor} from '../components/city/Props';
import {TitleText} from '../components/Overlays';
import {CLAMP, camera, ease} from '../lib/anim';
import {cueEnd, cueStart, hitsFor, isTalking} from '../data/fx';
import type {SceneTiming} from '../timeline';

/** Time-lapse: three hours later, a jhalmuri seller arrives. "পিকনিকে না!" */
export const Scene3: React.FC<{t: SceneTiming}> = ({t}) => {
  const f = useCurrentFrame();
  const d = t.duration;
  const hits = hitsFor(t);
  const [c0, , c2, c3] = [0, 1, 2, 3].map((i) => cueStart(t, i));
  const rTalk = isTalking(t, f, 'rumana');
  const kTalk = isTalking(t, f, 'karim');

  const lapse = interpolate(f, [0, 36], [0, 1], {...CLAMP, easing: ease});
  const minutes = interpolate(lapse, [0, 1], [9 * 60 + 5, 12 * 60 + 10]);
  const sunA = interpolate(lapse, [0, 1], [Math.PI * 0.85, Math.PI * 0.42]);
  const sun = {x: 540 + Math.cos(sunA) * 420, y: 560 - Math.sin(sunA) * 420};
  const vendorX = interpolate(f, [12, c0 - 4], [1350, 880], CLAMP);
  const walking = f > 12 && f < c0 - 4;
  const cam = camera(f, [
    {f: 0, x: 540, y: 900, s: 1.0},
    {f: c0, x: 600, y: 900, s: 1.02},
    {f: c2 - 4, x: 600, y: 900, s: 1.02},
    {f: c2 + 8, x: 380, y: 880, s: 1.3},
    {f: c3, x: 330, y: 880, s: 1.55},
    {f: d, x: 330, y: 880, s: 1.6},
  ]);
  const angry = f >= c2;

  return (
    <SceneShell t={t} vignette={0.3} {...cam} overlay={
      <>
        <ClockBadge minutes={minutes} label={minutes >= 12 * 60 ? 'দুপুর' : 'সকাল'} danger={minutes >= 11 * 60} />
        <TitleText text="তিন ঘণ্টা পর..." appearAt={2} until={c0 - 6} top={330} size={84} color="#fff6d6" glow="rgba(255,211,90,0.9)" />
      </>
    }>
      <Stage>
        <Street id="s3" sky={['#4fb3f5', '#9fd8ff', '#fff2c9']} sun={sun} />
        <Bus x={-250} y={LANE - 16} scale={0.8} color="#d23c3c" stripe="#ffffff" route="গুলিস্তান — মিরপুর" seed="b3r" />
        <Rickshaw
          idPrefix="s3r" x={470} y={LANE} scale={0.92} pedal={1}
          karim={{mood: 'happy', talking: kTalk, pose: f >= c0 - 2 && f < cueEnd(t, 1) + 10 ? 'offer' : 'ride', look: -1}}
          rumana={{mood: angry ? 'angry' : 'hurry', talking: rTalk, pose: angry ? 'fist' : 'watch', look: angry ? 1 : 0, fx: angry ? 'steam' : 'sweat'}}
        />
        <Vendor x={vendorX} y={LANE + 30} scale={0.85} walk={walking ? f * 0.35 : 0} mood="happy" />
        {hits.boing.map((h) => <Burst key={h} x={150} y={600} text="হুঁহ!" at={h} size={46} color="#ff7eb6" life={30} />)}
      </Stage>
    </SceneShell>
  );
};

