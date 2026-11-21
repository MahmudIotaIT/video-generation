import React from 'react';
import {useCurrentFrame} from 'remotion';

export type Mood = 'happy' | 'calm' | 'hurry' | 'angry' | 'shock' | 'smug' | 'sad';

export const SKIN = {karim: '#a86f4a', karimShade: '#8d5a39', rumana: '#e3b08a', rumanaShade: '#c99372', vendor: '#b97d55', boss: '#d9a07a'};

/** Two-bone IK: returns the joint (knee/elbow) between a and b. bend = +1 / -1 picks the side. */
export const ik = (a: [number, number], b: [number, number], l1: number, l2: number, bend = 1): [number, number] => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const d = Math.min(Math.hypot(dx, dy), l1 + l2 - 0.01);
  const ang = Math.atan2(dy, dx);
  const cos = (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d);
  const off = Math.acos(Math.max(-1, Math.min(1, cos))) * bend;
  return [a[0] + Math.cos(ang + off) * l1, a[1] + Math.sin(ang + off) * l1];
};

/** Mouth opening 0..1 that looks like syllables (deterministic). */
export const mouthOpen = (f: number, talking: boolean) =>
  talking ? 0.25 + 0.75 * Math.abs(Math.sin(f * 0.85)) * (0.55 + 0.45 * Math.abs(Math.sin(f * 0.31 + 1.3))) : 0;

/** Generic cartoon face drawn around (0,0) for a head of radius r. */
export const Face: React.FC<{r: number; mood: Mood; talking: boolean; seed?: number; lashes?: boolean; lips?: string; look?: number}> = ({
  r, mood, talking, seed = 0, lashes = false, lips = '#7a2e2e', look = 0,
}) => {
  const f = useCurrentFrame();
  const cycle = (f + seed * 37) % 110;
  const blink = cycle < 4 ? 0.12 : 1;
  const open = mouthOpen(f + seed * 5, talking);
  const ex = r * 0.36;
  const ey = -r * 0.05;
  const shock = mood === 'shock';
  const eyeR = r * (shock ? 0.17 : 0.13);
  const calmLid = mood === 'calm' || mood === 'smug';
  const px = look * eyeR * 0.45;

  // eyebrows: [leftInner, leftOuter] heights relative to eye (negative = up)
  const brow = {
    happy: [-0.36, -0.38], calm: [-0.3, -0.32], hurry: [-0.42, -0.3], angry: [-0.18, -0.4], shock: [-0.52, -0.48], smug: [-0.32, -0.42], sad: [-0.42, -0.26],
  }[mood];
  const mouthY = r * 0.42;
  const mw = r * 0.3;

  let mouth: React.ReactNode;
  if (talking || shock) {
    const h = shock && !talking ? r * 0.2 : r * (0.06 + 0.2 * open);
    mouth = (
      <g>
        <ellipse cx={0} cy={mouthY} rx={shock ? r * 0.15 : mw * 0.75} ry={h} fill="#4a1414" />
        <ellipse cx={0} cy={mouthY + h * 0.45} rx={(shock ? r * 0.1 : mw * 0.5)} ry={h * 0.4} fill="#d9606a" />
      </g>
    );
  } else if (mood === 'angry') {
    mouth = (
      <g>
        <rect x={-mw * 0.8} y={mouthY - r * 0.05} width={mw * 1.6} height={r * 0.13} rx={r * 0.05} fill="#fff" stroke="#4a1414" strokeWidth={r * 0.035} />
        <line x1={-mw * 0.8} y1={mouthY + r * 0.015} x2={mw * 0.8} y2={mouthY + r * 0.015} stroke="#4a1414" strokeWidth={r * 0.025} />
      </g>
    );
  } else if (mood === 'hurry' || mood === 'sad') {
    mouth = <path d={`M ${-mw * 0.6} ${mouthY + r * 0.06} Q 0 ${mouthY - r * 0.07} ${mw * 0.6} ${mouthY + r * 0.06}`} stroke={lips} strokeWidth={r * 0.06} fill="none" strokeLinecap="round" />;
  } else if (mood === 'smug') {
    mouth = <path d={`M ${-mw * 0.7} ${mouthY} Q ${mw * 0.1} ${mouthY + r * 0.16} ${mw * 0.85} ${mouthY - r * 0.1}`} stroke={lips} strokeWidth={r * 0.06} fill="none" strokeLinecap="round" />;
  } else {
    mouth = (
      <path d={`M ${-mw} ${mouthY - r * 0.04} Q 0 ${mouthY + r * 0.28} ${mw} ${mouthY - r * 0.04} Z`} fill="#4a1414" stroke={lips} strokeWidth={r * 0.03} strokeLinejoin="round" />
    );
  }

  return (
    <g>
      {[-1, 1].map((side) => (
        <g key={side} transform={`translate(${side * ex},${ey})`}>
          <ellipse cx={0} cy={0} rx={eyeR * 1.35} ry={eyeR * 1.5 * blink} fill="#fff" />
          <ellipse cx={px} cy={calmLid ? eyeR * 0.25 : 0} rx={eyeR * 0.8} ry={eyeR * 0.95 * blink * (calmLid ? 0.75 : 1)} fill="#22160f" />
          <circle cx={px + eyeR * 0.3} cy={-eyeR * 0.35} r={eyeR * 0.28 * blink} fill="#fff" />
          {calmLid && <path d={`M ${-eyeR * 1.45} ${-eyeR * 0.15} Q 0 ${-eyeR * 0.6} ${eyeR * 1.45} ${-eyeR * 0.15} L ${eyeR * 1.45} ${-eyeR * 1.6} L ${-eyeR * 1.45} ${-eyeR * 1.6} Z`} fill="currentColor" />}
          {lashes && (
            <path d={`M ${side * eyeR * 1.1} ${-eyeR * 1.1} l ${side * eyeR * 0.45} ${-eyeR * 0.35} M ${side * eyeR * 0.55} ${-eyeR * 1.4} l ${side * eyeR * 0.25} ${-eyeR * 0.45}`} stroke="#22160f" strokeWidth={r * 0.035} strokeLinecap="round" />
          )}
          <line
            x1={-side * eyeR * 1.2} y1={r * brow[0]} x2={side * eyeR * 1.3} y2={r * brow[1]}
            stroke="#22160f" strokeWidth={r * 0.075} strokeLinecap="round" transform={`translate(0,${ey * -1})`}
          />
        </g>
      ))}
      <circle cx={-r * 0.55} cy={r * 0.25} r={r * 0.13} fill="#ff8a8a" opacity={mood === 'angry' ? 0.6 : 0.35} />
      <circle cx={r * 0.55} cy={r * 0.25} r={r * 0.13} fill="#ff8a8a" opacity={mood === 'angry' ? 0.6 : 0.35} />
      {mouth}
    </g>
  );
};

/** Karim mama: rickshaw puller, checked gamchha tied on the head, thick moustache. Head centre at (0,0). */
export const KarimHead: React.FC<{r?: number; mood: Mood; talking: boolean; tilt?: number; look?: number}> = ({r = 58, mood, talking, tilt = 0, look = 0}) => (
  <g transform={`rotate(${tilt})`} style={{color: SKIN.karim}}>
    <circle cx={-r * 0.95} cy={r * 0.1} r={r * 0.22} fill={SKIN.karimShade} />
    <circle cx={r * 0.95} cy={r * 0.1} r={r * 0.22} fill={SKIN.karimShade} />
    <ellipse cx={0} cy={0} rx={r} ry={r * 1.05} fill={SKIN.karim} />
    <path d={`M ${-r * 0.95} ${-r * 0.2} Q ${-r * 0.9} ${-r * 1.05} 0 ${-r * 1.05} Q ${r * 0.9} ${-r * 1.05} ${r * 0.95} ${-r * 0.2} Q ${r * 0.5} ${-r * 0.7} 0 ${-r * 0.72} Q ${-r * 0.5} ${-r * 0.7} ${-r * 0.95} ${-r * 0.2} Z`} fill="#1f1712" />
    {/* gamchha headband */}
    <path d={`M ${-r * 1.02} ${-r * 0.42} Q 0 ${-r * 0.75} ${r * 1.02} ${-r * 0.42} L ${r * 1.0} ${-r * 0.2} Q 0 ${-r * 0.52} ${-r * 1.0} ${-r * 0.2} Z`} fill="#d23c3c" />
    {[-0.7, -0.35, 0, 0.35, 0.7].map((k) => (
      <line key={k} x1={r * k} y1={-r * 0.62} x2={r * k} y2={-r * 0.34} stroke="#fff" strokeWidth={r * 0.06} opacity={0.85} />
    ))}
    <path d={`M ${-r * 1.02} ${-r * 0.33} Q 0 ${-r * 0.62} ${r * 1.02} ${-r * 0.33}`} stroke="#fff" strokeWidth={r * 0.05} fill="none" opacity={0.8} />
    <path d={`M ${-r * 1.0} ${-r * 0.3} q ${-r * 0.35} ${r * 0.05} ${-r * 0.42} ${r * 0.4} q ${r * 0.2} ${-r * 0.1} ${r * 0.38} ${-r * 0.2} Z`} fill="#d23c3c" />
    <Face r={r} mood={mood} talking={talking} seed={2} look={look} />
    {/* nose + moustache */}
    <path d={`M ${-r * 0.02} ${r * 0.05} q ${r * 0.16} ${r * 0.14} ${r * 0.02} ${r * 0.2}`} stroke={SKIN.karimShade} strokeWidth={r * 0.06} fill="none" strokeLinecap="round" />
    <path d={`M ${-r * 0.42} ${r * 0.36} Q ${-r * 0.2} ${r * 0.2} 0 ${r * 0.3} Q ${r * 0.2} ${r * 0.2} ${r * 0.42} ${r * 0.36} Q ${r * 0.2} ${r * 0.3} 0 ${r * 0.36} Q ${-r * 0.2} ${r * 0.3} ${-r * 0.42} ${r * 0.36} Z`} fill="#1f1712" />
    {[[-0.5, 0.7], [-0.25, 0.8], [0.25, 0.8], [0.5, 0.7], [0, 0.86]].map(([x, y], i) => (
      <circle key={i} cx={r * x} cy={r * y} r={r * 0.025} fill="#3a2a20" opacity={0.6} />
    ))}
  </g>
);

/** Rumana apa: office-goer, hair bun, gold earrings. Head centre at (0,0). */
export const RumanaHead: React.FC<{r?: number; mood: Mood; talking: boolean; tilt?: number; look?: number}> = ({r = 62, mood, talking, tilt = 0, look = 0}) => (
  <g transform={`rotate(${tilt})`} style={{color: SKIN.rumana}}>
    <circle cx={-r * 0.55} cy={-r * 0.85} r={r * 0.42} fill="#1c1420" />
    <path d={`M ${-r * 1.05} ${r * 0.1} Q ${-r * 1.2} ${-r * 1.15} 0 ${-r * 1.12} Q ${r * 1.2} ${-r * 1.15} ${r * 1.05} ${r * 0.1} Q ${r * 1.1} ${r * 0.6} ${r * 0.8} ${r * 0.75} L ${-r * 0.8} ${r * 0.75} Q ${-r * 1.1} ${r * 0.6} ${-r * 1.05} ${r * 0.1} Z`} fill="#1c1420" />
    <ellipse cx={0} cy={r * 0.02} rx={r * 0.9} ry={r} fill={SKIN.rumana} />
    <path d={`M ${-r * 0.92} ${-r * 0.1} Q ${-r * 0.8} ${-r * 0.95} ${r * 0.1} ${-r * 0.98} Q ${-r * 0.1} ${-r * 0.55} ${-r * 0.92} ${-r * 0.1} Z`} fill="#1c1420" />
    <path d={`M ${r * 0.92} ${-r * 0.1} Q ${r * 0.85} ${-r * 0.9} ${0} ${-r * 0.98} Q ${r * 0.45} ${-r * 0.6} ${r * 0.92} ${-r * 0.1} Z`} fill="#1c1420" />
    <circle cx={-r * 0.9} cy={r * 0.35} r={r * 0.1} fill="#f2c14e" />
    <circle cx={r * 0.9} cy={r * 0.35} r={r * 0.1} fill="#f2c14e" />
    <Face r={r * 0.95} mood={mood} talking={talking} seed={5} lashes lips="#c2415d" look={look} />
    <path d={`M ${-r * 0.02} ${r * 0.08} q ${r * 0.12} ${r * 0.12} 0 ${r * 0.18}`} stroke={SKIN.rumanaShade} strokeWidth={r * 0.05} fill="none" strokeLinecap="round" />
  </g>
);

/** Comic accessories that float near a head. */
export const AngerMark: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
  const f = useCurrentFrame();
  const p = 1 + Math.sin(f * 0.6) * 0.12;
  return (
    <g transform={`translate(${x},${y}) scale(${s * p})`}>
      {[0, 90, 180, 270].map((a) => (
        <path key={a} d="M 6 -6 Q 22 -8 26 -26 M 6 -6 Q 8 -22 26 -26" stroke="#ff3b4f" strokeWidth={8} fill="none" strokeLinecap="round" transform={`rotate(${a})`} />
      ))}
    </g>
  );
};

export const SweatDrops: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {[0, 1].map((k) => {
        const t = ((f + k * 18) % 36) / 36;
        return <path key={k} d="M 0 0 Q 12 18 0 26 Q -12 18 0 0 Z" fill="#8fd3ff" stroke="#3a8fd0" strokeWidth={3} transform={`translate(${k * 26},${t * 40}) `} opacity={1 - t} />;
      })}
    </g>
  );
};

export const Steam: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {[0, 1, 2].map((k) => {
        const t = ((f + k * 10) % 30) / 30;
        return <circle key={k} cx={(k - 1) * 40 + Math.sin(f / 4 + k) * 8} cy={-t * 110} r={18 + t * 26} fill="#ffffff" opacity={0.85 * (1 - t)} />;
      })}
    </g>
  );
};
