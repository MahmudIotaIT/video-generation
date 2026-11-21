import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneShell} from '../components/SceneShell';
import {LANE, Stage, Street} from '../components/city/Backdrop';
import {Rickshaw} from '../components/city/Rickshaw';
import {Bus} from '../components/city/Vehicles';
import {Burst, ClockBadge, RingingPhone, VideoCall} from '../components/city/Props';
import {CLAMP, camera, ramp} from '../lib/anim';
import {cueStart, hitsFor, isTalking} from '../data/fx';
import {W, H} from '../theme';
import type {SceneTiming} from '../timeline';

/** The boss calls: meeting from the rickshaw, Karim photobombs. */
export const Scene5: React.FC<{t: SceneTiming}> = ({t}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const d = t.duration;
  const hits = hitsFor(t);
  const [c0, , c2, c3] = [0, 1, 2, 3].map((i) => cueStart(t, i));
  const rTalk = isTalking(t, f, 'rumana');
  const kTalk = isTalking(t, f, 'karim');

  const appear = f >= c0 - 6 ? spring({frame: f - (c0 - 6), fps, config: {damping: 13, stiffness: 120}}) : 0;
  const karimIn = ramp(f, c2 - 4, c2 + 10);
  const cam = camera(f, [
    {f: 0, x: 400, y: 840, s: 1.35},
    {f: d, x: 420, y: 860, s: 1.25},
  ]);

  return (
    <SceneShell t={t} vignette={0.35} {...cam} overlay={
      <>
        <ClockBadge minutes={13 * 60 + 15 + interpolate(f, [0, d], [0, 2], CLAMP)} label="দুপুর" danger />
        <AbsoluteFill style={{pointerEvents: 'none'}}>
          <svg width={W} height={H} style={{overflow: 'visible'}}>
            <rect width={W} height={H} fill="#0b0820" opacity={0.45 * Math.min(1, appear)} />
            <RingingPhone x={760} y={560} scale={1.2} on={f >= hits.phone[0] && f < c0 - 6} />
            {appear > 0.01 && <VideoCall x={540} y={760} scale={1} appear={Math.min(1.05, appear)} karim={karimIn} rumanaTalking={rTalk} bossTalking={false} />}
            {f >= c3 &&
              Array.from({length: 8}).map((_, k) => {
                const tt = ((f - c3) * 1.4 + k * 14) % 90;
                return (
                  <path key={k} d="M 0 8 C -24 -12 -10 -30 0 -16 C 10 -30 24 -12 0 8 Z" fill={k % 2 ? '#ff5a7a' : '#ffd35a'}
                    transform={`translate(${200 + k * 95},${1150 - tt * 7}) scale(${1.6})`} opacity={1 - tt / 90} />
                );
              })}
            {hits.pop.slice(1).map((h) => <Burst key={h} x={800} y={300} text="ভাইরাল!" at={h + 18} size={48} color="#ff7eb6" life={50} />)}
          </svg>
        </AbsoluteFill>
      </>
    }>
      <Stage>
        <Street id="s5" sky={['#3aa6f0', '#8fd0ff', '#fff4cf']} sun={{x: 820, y: 180}} />
        <Bus x={-250} y={LANE - 16} scale={0.8} color="#d23c3c" stripe="#ffffff" route="গুলিস্তান — মিরপুর" seed="b5r" />
        <Rickshaw
          idPrefix="s5r" x={545} y={LANE} scale={0.92} pedal={1}
          karim={{mood: f >= c2 ? 'happy' : 'calm', talking: kTalk, pose: f >= c2 ? 'wave' : 'ride', look: -1}}
          rumana={{mood: f < c0 ? 'shock' : 'hurry', talking: rTalk, pose: 'phone', look: 0, fx: f < c0 ? 'sweat' : null}}
        />
      </Stage>
    </SceneShell>
  );
};
