import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {SceneShell, Vignette} from '../components/SceneShell';
import {MAP_H, MapView, PTS} from '../components/MapView';
import {Badge} from '../components/Overlays';
import {CLAMP, ramp} from '../lib/anim';
import {cueEnd, cueStart} from '../data/fx';
import {FONT, H, W} from '../theme';
import type {SceneTiming} from '../timeline';

const MAP_TOP = 330;

const Globe: React.FC<{f: number}> = ({f}) => {
  const r = 300;
  const rot = f * 0.04;
  const pulse = 0.5 + 0.5 * Math.sin(f / 5);
  return (
    <g>
      <defs>
        <radialGradient id="globeG" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#3fa9f5" />
          <stop offset="100%" stopColor="#0a2a5c" />
        </radialGradient>
        <clipPath id="globeClip"><circle r={r} /></clipPath>
      </defs>
      <circle r={r + 22} fill="rgba(80,190,255,0.15)" />
      <circle r={r} fill="url(#globeG)" />
      <g clipPath="url(#globeClip)">
        <path d="M -230 -190 C -140 -240, -40 -210, -30 -140 C -20 -90, -90 -70, -110 -20 C -130 20, -170 -40, -240 -80 Z" fill="#d9c79a" />
        <path d="M -60 20 C 0 10, 30 60, 10 120 C -10 180, -50 230, -60 280 C -80 200, -110 100, -60 20 Z" fill="#d9c79a" />
        <path d="M 150 -200 C 210 -210, 260 -150, 250 -80 C 230 -20, 190 40, 200 120 C 150 60, 130 -40, 150 -200 Z" fill="#d9c79a" />
        {Array.from({length: 6}).map((_, k) => (
          <ellipse key={k} rx={r * Math.abs(Math.cos(rot + (k * Math.PI) / 6))} ry={r} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={2} />
        ))}
        {[-60, -30, 0, 30, 60].map((la) => {
          const y = -r * Math.sin((la * Math.PI) / 180);
          const w = r * Math.cos((la * Math.PI) / 180);
          return <ellipse key={la} cy={y} rx={w} ry={w * 0.1} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={2} />;
        })}
      </g>
      <circle cx={-10} cy={-70} r={16 + pulse * 18} fill="rgba(56,232,255,0.3)" />
      <circle cx={-10} cy={-70} r={12} fill="#38e8ff" />
      <text x={-10} y={-120} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill="#fff" stroke="rgba(0,0,0,0.7)" strokeWidth={8} paintOrder="stroke">
        উত্তর আটলান্টিক
      </text>
    </g>
  );
};

export const Scene2: React.FC<{t: SceneTiming}> = ({t}) => {
  const f = useCurrentFrame();
  const d = t.duration;
  const back = Easing.out(Easing.back(1.6));
  const globeScale = interpolate(f, [0, 30, 58], [0.7, 1, 2.8], CLAMP);
  const globeOp = 1 - ramp(f, 36, 58);
  const mapIn = ramp(f, 34, 60);
  const p2s = cueStart(t, 2);
  const p2e = cueEnd(t, 2);
  const pins = [p2s, p2s + (p2e - p2s) * 0.35, p2s + (p2e - p2s) * 0.7].map((s) => ramp(f, s, s + 14, 0, 1, back));
  const triStart = cueStart(t, 3);
  const triEnd = cueStart(t, 4) + 12;
  const tri = ramp(f, triStart, triEnd);
  const triFill = ramp(f, triEnd - 6, triEnd + 20);
  const {bermuda: B, miami: M, sanjuan: S} = PTS;
  const cx = (B[0] + M[0] + S[0]) / 3;
  const cy = (B[1] + M[1] + S[1]) / 3 + MAP_TOP;
  const zoom = ramp(f, triStart, d, 0, 1);
  const camScale = interpolate(f, [40, d], [1.0, 1.12], CLAMP) + zoom * 0.04;
  const camX = (W / 2 - cx) * zoom * 0.9;
  const camY = (H / 2 - cy) * zoom * 0.9;

  return (
    <SceneShell t={t} scale={camScale} x={camX} y={camY} overlay={
      <>
        <Badge kicker="অবস্থান" text="উত্তর আটলান্টিক মহাসাগর" appearAt={45} top={150} tone="info" until={triEnd + 4} />
        <Badge kicker="জেনে রাখুন" text="এই ত্রিভুজের কোনো সরকারি সীমানা নেই" appearAt={triEnd + 12} top={150} tone="info" size={38} />
      </>
    }>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #0e3566 0%, #04122a 75%)'}} />
      <AbsoluteFill style={{opacity: mapIn, transform: `scale(${0.85 + 0.15 * mapIn})`}}>
        <div style={{position: 'absolute', top: MAP_TOP, left: 0, width: W, height: MAP_H}}>
          <MapView pins={pins} tri={tri} triFill={triFill} oceanLabel={ramp(f, cueStart(t, 0), cueStart(t, 0) + 15)} />
        </div>
      </AbsoluteFill>
      {globeOp > 0 && (
        <AbsoluteFill style={{opacity: globeOp}}>
          <svg width={W} height={H}>
            <g transform={`translate(${W / 2},${880}) scale(${globeScale})`}>
              <Globe f={f} />
            </g>
          </svg>
        </AbsoluteFill>
      )}
      <Vignette strength={0.55} />
    </SceneShell>
  );
};
