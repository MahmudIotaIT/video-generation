import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneShell, Vignette} from '../components/SceneShell';
import {Sky} from '../components/Sky';
import {CloudLayer, Flash, Lightning, Rain} from '../components/Weather';
import {Ocean} from '../components/Ocean';
import {Ship} from '../components/Ship';
import {Person} from '../components/Person';
import {Compass} from '../components/Compass';
import {Badge} from '../components/Overlays';
import {Icon, IconKind} from '../components/Icons';
import {CLAMP, mono, ramp, windowed} from '../lib/anim';
import {cueStart, strikesFor} from '../data/fx';
import {COLORS, FONT, H, W} from '../theme';
import type {SceneTiming} from '../timeline';

const CHIPS: {kind: IconKind; label: string}[] = [
  {kind: 'storm', label: 'ঝড়'},
  {kind: 'wave', label: 'ঢেউ'},
  {kind: 'current', label: 'স্রোত'},
  {kind: 'compass', label: 'নেভিগেশন'},
  {kind: 'human', label: 'মানুষের ভুল'},
];

const Chip: React.FC<{kind: IconKind; label: string; lit: number; big?: boolean}> = ({kind, label, lit, big}) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: big ? 20 : 12, padding: big ? '18px 36px' : '10px 22px', borderRadius: 999,
    background: lit > 0.5 ? 'rgba(56,232,255,0.22)' : 'rgba(10,20,40,0.65)',
    border: `3px solid ${lit > 0.5 ? COLORS.glow : 'rgba(255,255,255,0.18)'}`,
    boxShadow: lit > 0.5 ? '0 0 24px rgba(56,232,255,0.5)' : 'none',
    transform: `scale(${0.92 + 0.08 * lit})`, opacity: 0.45 + 0.55 * lit,
    fontFamily: FONT, fontWeight: 700, fontSize: big ? 52 : 34, color: '#fff', lineHeight: 1.4,
  }}>
    <Icon kind={kind} size={big ? 64 : 40} />
    {label}
  </div>
);

export const Scene4: React.FC<{t: SceneTiming}> = ({t}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const d = t.duration;
  const s = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => cueStart(t, i));
  const strikes = strikesFor(t);

  const introOp = 1 - ramp(f, s[2] - 8, s[2] + 6);
  const seaOp = ramp(f, s[2] - 8, s[2] + 6);
  const rough = interpolate(f, mono([s[2], s[3], s[3] + 20, s[4] + 10, d]), [1.3, 1.6, 2.7, 1.5, 1.3], CLAMP);
  const rainOp = windowed(f, s[2], s[4] + 10, 8, 20);
  const curOp = windowed(f, s[4] - 4, s[5] + 6);
  const compOp = windowed(f, s[5] - 4, s[6] + 6);
  const humOp = windowed(f, s[6] - 4, s[7] + 6);
  const finOp = ramp(f, s[7] - 4, s[7] + 8);
  const dim = Math.max(compOp, humOp, finOp) * 0.62;
  const stamp = spring({frame: f - (s[1] + 18), fps, config: {damping: 10, stiffness: 160}});
  const compPop = spring({frame: f - s[5], fps, config: {damping: 12}});
  const needle = 25 * Math.sin(f * 0.23) + 40 * Math.sin(f * 0.061);

  const currents = [
    'M -100 1500 C 200 1300, 500 1450, 800 1200 S 1100 1000, 1250 900',
    'M -100 1650 C 250 1450, 550 1600, 850 1350 S 1150 1150, 1250 1050',
    'M -100 1350 C 150 1180, 450 1300, 750 1060 S 1050 880, 1250 760',
  ];

  return (
    <SceneShell t={t} overlay={
      <>
        {f >= s[2] - 5 && finOp < 1 && (
          <AbsoluteFill style={{pointerEvents: 'none', opacity: 1 - finOp}}>
            <div style={{position: 'absolute', top: 170, left: 40, right: 40, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16}}>
              {CHIPS.map((c, i) => <Chip key={c.kind} {...c} lit={ramp(f, s[2 + i], s[2 + i] + 8)} />)}
            </div>
          </AbsoluteFill>
        )}
        <Badge kicker="ব্যাখ্যা" text="উপসাগরীয় স্রোত (গাল্ফ স্ট্রিম) ধ্বংসাবশেষ দ্রুত দূরে সরিয়ে নিতে পারে" appearAt={s[4]} top={370} tone="info" size={36} opacity={curOp} />
        <Badge kicker="ব্যাখ্যা" text="চুম্বকীয় কম্পাসের বিচ্যুতি ও দিক নির্ণয়ের ভুল" appearAt={s[5]} top={370} tone="info" size={38} opacity={compOp} />
        <Badge kicker="রেকর্ড অনুযায়ী" text="ফ্লাইট ১৯-এর দলনেতা ভেবেছিলেন তাঁরা ফ্লোরিডা কিজের ওপর আছেন — সম্ভবত ছিলেন বাহামার কাছে" appearAt={s[6]} top={370} tone="record" size={34} opacity={humOp} />
        <Flash strikes={strikes} max={0.45} />
      </>
    }>
      {introOp > 0 && (
        <AbsoluteFill style={{opacity: introOp}}>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, #0b2238 0%, #123b5a 100%)'}} />
          <AbsoluteFill style={{opacity: 0.25, background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0 2px, transparent 2px 80px), repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0 2px, transparent 2px 80px)'}} />
          <div style={{position: 'absolute', top: 360, left: 440, width: 560, padding: '40px 36px', borderRadius: 32, background: 'rgba(5,15,35,0.85)',
            border: '3px solid rgba(255,159,67,0.6)', fontFamily: FONT, color: '#fff', textAlign: 'center',
            transform: `translateY(${(1 - ramp(f, s[0], s[0] + 15)) * 40}px)`, opacity: ramp(f, s[0], s[0] + 15)}}>
            <div style={{fontSize: 30, color: COLORS.legend, fontWeight: 600}}>● জনপ্রিয় গল্প</div>
            <div style={{fontSize: 64, fontWeight: 700, lineHeight: 1.4, marginTop: 10}}>অতিপ্রাকৃত শক্তি?</div>
            {f >= s[1] + 18 && (
              <div style={{marginTop: 26, display: 'inline-block', padding: '10px 30px', border: `6px solid ${COLORS.danger}`, borderRadius: 16, color: COLORS.danger,
                fontSize: 60, fontWeight: 700, transform: `rotate(-10deg) scale(${2 - Math.min(1, stamp)})`, opacity: Math.min(1, stamp)}}>
                প্রমাণ নেই
              </div>
            )}
          </div>
          <AbsoluteFill>
            <svg width={W} height={H}>
              <Person x={270} y={1420} scale={1.05} role="scientist" talking={f >= s[0] && f < s[2]} />
            </svg>
          </AbsoluteFill>
          <Vignette strength={0.5} />
        </AbsoluteFill>
      )}
      {seaOp > 0 && (
        <AbsoluteFill style={{opacity: seaOp}}>
          <Sky stops={['#0a0f1f', '#1b2440 50%', '#2a3555 62%']} />
          <Lightning strikes={strikes} y0={120} y1={950} />
          <CloudLayer seed="s4a" count={7} yMin={100} yMax={700} color="#161d33" speed={1.8} scale={2.2} />
          <Ocean horizonY={1080} colors={['#1d3350', '#172b47', '#12233c', '#0d1b30', '#091425']} roughness={rough} speed={1.4} split={2}>
            <Ship x={560} y={1125} scale={0.9} rock={rough} lights />
          </Ocean>
          <AbsoluteFill style={{opacity: rainOp}}><Rain count={150} opacity={0.5} /></AbsoluteFill>
          {curOp > 0 && (
            <AbsoluteFill style={{opacity: curOp}}>
              <svg width={W} height={H}>
                <defs>
                  <filter id="curGlow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="6" /></filter>
                </defs>
                {currents.map((p, i) => (
                  <g key={i}>
                    <path d={p} stroke={COLORS.glow} strokeWidth={22} fill="none" opacity={0.35} filter="url(#curGlow)" />
                    <path d={p} stroke="#c9fbff" strokeWidth={9} fill="none" strokeDasharray="60 40" strokeDashoffset={-f * 7 - i * 30} strokeLinecap="round" />
                  </g>
                ))}
              </svg>
            </AbsoluteFill>
          )}
          <AbsoluteFill style={{background: '#030814', opacity: dim}} />
          {compOp > 0 && (
            <AbsoluteFill style={{opacity: compOp}}>
              <svg width={W} height={H}>
                <g transform={`translate(540,930) scale(${0.6 + 0.4 * Math.min(1, compPop)}) translate(-540,-930)`}>
                  <Compass cx={540} cy={930} r={270} angle={needle} />
                </g>
              </svg>
            </AbsoluteFill>
          )}
          {humOp > 0 && (
            <AbsoluteFill style={{opacity: humOp}}>
              <svg width={W} height={H}>
                <Person x={540} y={1400} scale={1.05} role="navigator" confused talking />
              </svg>
            </AbsoluteFill>
          )}
          {finOp > 0 && (
            <AbsoluteFill style={{opacity: finOp, justifyContent: 'center', alignItems: 'center', gap: 22, paddingBottom: 380, display: 'flex', flexDirection: 'column'}}>
              <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 56, color: COLORS.gold, marginBottom: 10, textShadow: '0 4px 20px rgba(0,0,0,0.8)'}}>সম্ভাব্য বৈজ্ঞানিক ব্যাখ্যা</div>
              {CHIPS.map((c, i) => (
                <div key={c.kind} style={{transform: `translateX(${(1 - ramp(f, s[7] + i * 4, s[7] + i * 4 + 12, 0, 1, Easing.out(Easing.cubic))) * (i % 2 ? 300 : -300)}px)`}}>
                  <Chip {...c} lit={1} big />
                </div>
              ))}
            </AbsoluteFill>
          )}
          <Vignette />
        </AbsoluteFill>
      )}
    </SceneShell>
  );
};
