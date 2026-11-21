import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneShell} from '../components/SceneShell';
import {GROUND, LANE, Stage, Street} from '../components/city/Backdrop';
import {Rickshaw} from '../components/city/Rickshaw';
import {Burst, ClockBadge, OfficeGate} from '../components/city/Props';
import {CLAMP, camera, ease, ramp} from '../lib/anim';
import {cueEnd, cueStart, hitsFor, isTalking} from '../data/fx';
import {COLORS, FONT} from '../theme';
import type {SceneTiming} from '../timeline';

/** Evening: they finally arrive… the office is closed. CTA. */
export const Scene6: React.FC<{t: SceneTiming}> = ({t}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const d = t.duration;
  const hits = hitsFor(t);
  const [c0, c1, c2, c3, c4] = [0, 1, 2, 3, 4].map((i) => cueStart(t, i));
  const rTalk = isTalking(t, f, 'rumana');
  const kTalk = isTalking(t, f, 'karim');

  const arrive = Math.max(10, c0 - 6);
  const rx = interpolate(f, [0, arrive], [-420, 380], {...CLAMP, easing: ease});
  const roll = rx * 0.55;
  const pedal = rx * 0.025;
  const sad = f >= cueEnd(t, 1) + 4;
  const cam = camera(f, [
    {f: 0, x: 540, y: 900, s: 1.0},
    {f: c1 - 2, x: 560, y: 900, s: 1.0},
    {f: c1 + 14, x: 820, y: 900, s: 1.45},
    {f: c2 - 4, x: 820, y: 900, s: 1.5},
    {f: c2 + 10, x: 480, y: 880, s: 1.12},
    {f: c4 - 6, x: 480, y: 880, s: 1.12},
    {f: c4 + 10, x: 520, y: 960, s: 0.95},
    {f: d, x: 520, y: 960, s: 0.95},
  ]);
  const cta = spring({frame: f - c4, fps, config: {damping: 9, stiffness: 120}});
  const bounce = Math.sin(f / 6) * 6;

  return (
    <SceneShell t={t} vignette={0.45} {...cam} fadeOut={24} overlay={
      <>
        <ClockBadge minutes={17 * 60 + 30 + interpolate(f, [0, d], [0, 3], CLAMP)} label="সন্ধ্যা" danger />
        {f >= c4 && (
          <AbsoluteFill style={{pointerEvents: 'none', background: `rgba(10,6,30,${0.45 * Math.min(1, cta)})`}}>
            <div style={{position: 'absolute', top: 300, left: 50, right: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22,
              transform: `scale(${0.6 + 0.4 * Math.min(1.1, cta)})`, opacity: Math.min(1, cta), fontFamily: FONT}}>
              <svg width={130} height={120} viewBox="0 0 130 120" style={{transform: `translateY(${bounce}px)`}}>
                <path d="M 15 10 H 115 a 12 12 0 0 1 12 12 V 72 a 12 12 0 0 1 -12 12 H 55 L 25 110 V 84 H 15 a 12 12 0 0 1 -12 -12 V 22 a 12 12 0 0 1 12 -12 Z" fill={COLORS.gold} />
                <circle cx={40} cy={47} r={8} fill="#1b2440" />
                <circle cx={65} cy={47} r={8} fill="#1b2440" />
                <circle cx={90} cy={47} r={8} fill="#1b2440" />
              </svg>
              <div style={{fontSize: 76, fontWeight: 700, color: '#fff', textAlign: 'center', lineHeight: 1.35, textShadow: '0 0 30px rgba(255,126,182,0.8), 0 6px 0 rgba(0,0,0,0.6)'}}>
                আপনার মতামত কমেন্টে জানান!
              </div>
              <div style={{fontSize: 40, fontWeight: 600, color: '#ffe6f0', textAlign: 'center', lineHeight: 1.4}}>জ্যামে পড়লে আপনি কী করেন?</div>
              <div style={{display: 'flex', gap: 18, marginTop: 6}}>
                {['ক) রিকশাই ভরসা', 'খ) হেঁটেই যাব!'].map((o, i) => (
                  <div key={o} style={{padding: '14px 26px', borderRadius: 999, fontSize: 36, fontWeight: 700, color: '#fff', lineHeight: 1.4,
                    background: i ? 'rgba(126,224,161,0.25)' : 'rgba(255,126,182,0.25)', border: `3px solid ${i ? '#7ee0a1' : '#ff7eb6'}`,
                    opacity: ramp(f, c4 + 12 + i * 6, c4 + 22 + i * 6)}}>
                    {o}
                  </div>
                ))}
              </div>
            </div>
          </AbsoluteFill>
        )}
      </>
    }>
      <Stage>
        <Street id="s6" sky={['#2a1f5c', '#7a3f86', '#ff8a6a', '#ffcf8a']} sun={{x: 160, y: 820, color: '#ff9a4a'}} night={0.55} cloudColor="#ffc2b0" haze="#9a86b8" />
        <OfficeGate x={830} y={GROUND + 70} scale={0.62} night={0.6} />
        <Rickshaw
          idPrefix="s6r" x={rx} y={LANE} scale={0.92} roll={roll} pedal={pedal} bob={f < arrive ? Math.abs(Math.sin(f * 0.5)) * -4 : 0}
          karim={{mood: f >= c2 ? 'smug' : 'happy', talking: kTalk, pose: f >= c0 && f < c1 ? 'wave' : f >= c2 && f < c4 ? 'shrug' : 'ride', look: f >= c2 ? -1 : 1}}
          rumana={{mood: f >= c4 ? 'happy' : sad ? 'sad' : f >= c1 ? 'shock' : 'hurry', talking: rTalk, pose: f >= c1 && f < c2 ? 'hands' : 'sit', look: 1, fx: sad && f < c4 ? 'sweat' : null}}
        />
        {hits.bell.map((h) => <Burst key={`b${h}`} x={rx + 260} y={820} text="ক্রিং ক্রিং!" at={h} size={42} rot={8} />)}
        {hits.trombone.map((h) => <Burst key={`t${h}`} x={330} y={520} text="ওয়া-ওয়া-ওয়া..." at={h} size={38} color="#9ad0ff" life={80} rot={-6} />)}
        {hits.boing.map((h) => <Burst key={`o${h}`} x={760} y={520} text="কাল?!" at={h} size={46} color="#ff7eb6" />)}
      </Stage>
    </SceneShell>
  );
};
