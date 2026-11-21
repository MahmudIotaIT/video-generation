import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {FONT} from '../../theme';

const Tyre: React.FC<{cx: number; cy: number; r: number; roll?: number}> = ({cx, cy, r, roll = 0}) => (
  <g transform={`translate(${cx},${cy}) rotate(${roll})`}>
    <circle r={r} fill="#1b1b1f" />
    <circle r={r * 0.55} fill="#a3a9b4" />
    {[0, 72, 144, 216, 288].map((a) => (
      <circle key={a} cx={Math.cos((a * Math.PI) / 180) * r * 0.32} cy={Math.sin((a * Math.PI) / 180) * r * 0.32} r={r * 0.08} fill="#5b616b" />
    ))}
  </g>
);

/** Old city bus (side view, facing right). Origin = ground centre. Length ≈ 1100. */
export const Bus: React.FC<{x: number; y: number; scale?: number; color?: string; stripe?: string; route?: string; shake?: number; seed?: string; flip?: boolean; roll?: number}> = ({
  x, y, scale = 1, color = '#2f9e5b', stripe = '#f2c14e', route = 'মতিঝিল — গাবতলী', shake = 0, seed = 'bus', flip = false, roll = 0,
}) => {
  const f = useCurrentFrame();
  const jit = shake ? Math.sin(f * 2.1) * 4 * shake : 0;
  const idle = Math.sin(f * 0.9) * 1.5;
  const L = 1100;
  const Hh = 470;
  return (
    <g transform={`translate(${x + jit},${y + idle}) scale(${flip ? -scale : scale},${scale})`}>
      <ellipse cx={0} cy={4} rx={L / 2 + 20} ry={24} fill="rgba(0,0,0,0.28)" />
      <path d={`M ${-L / 2} -70 L ${-L / 2} ${-Hh + 30} Q ${-L / 2} ${-Hh} ${-L / 2 + 30} ${-Hh} L ${L / 2 - 90} ${-Hh} Q ${L / 2 - 10} ${-Hh} ${L / 2} ${-Hh + 120} L ${L / 2} -70 Z`} fill={color} stroke="rgba(0,0,0,0.3)" strokeWidth={6} />
      <rect x={-L / 2} y={-150} width={L} height={40} fill={stripe} />
      <rect x={-L / 2} y={-110} width={L} height={40} fill="rgba(0,0,0,0.25)" />
      {/* windows with passengers */}
      {Array.from({length: 8}).map((_, i) => {
        const wx = -L / 2 + 40 + i * 120;
        const head = random(`${seed}h${i}`) < 0.85;
        return (
          <g key={i}>
            <rect x={wx} y={-Hh + 50} width={96} height={130} rx={10} fill="#9fd3ee" stroke="#e9f1f6" strokeWidth={5} />
            {head && (
              <g>
                <circle cx={wx + 48} cy={-Hh + 140} r={26} fill={['#a86f4a', '#d9a07a', '#c18661', '#8d5a39'][i % 4]} />
                <path d={`M ${wx + 22} ${-Hh + 132} Q ${wx + 48} ${-Hh + 98} ${wx + 74} ${-Hh + 132}`} fill="#1f1712" />
                <rect x={wx + 16} y={-Hh + 166} width={64} height={20} rx={10} fill={['#d23c3c', '#3a6fd0', '#f2c14e', '#7a4b9a'][i % 4]} />
              </g>
            )}
          </g>
        );
      })}
      {/* door with people hanging out */}
      <rect x={L / 2 - 120} y={-Hh + 50} width={80} height={330} rx={8} fill="#24303f" />
      {[0, 1].map((k) => (
        <g key={k} transform={`translate(${L / 2 - 50 + k * 30},${-Hh + 170 + k * 70}) rotate(${12 + Math.sin(f / 8 + k) * 4})`}>
          <rect x={-14} y={0} width={34} height={90} rx={14} fill={k ? '#3a6fd0' : '#f2f0e6'} />
          <circle cx={4} cy={-22} r={24} fill={k ? '#c18661' : '#a86f4a'} />
          <path d={`M -18 -30 Q 4 -56 26 -30`} fill="#1f1712" />
          <line x1={10} y1={10} x2={-30} y2={-40} stroke={k ? '#c18661' : '#a86f4a'} strokeWidth={14} strokeLinecap="round" />
        </g>
      ))}
      {/* dents & scratches */}
      <path d={`M ${-L / 2 + 160} -210 q 30 20 60 0 M ${-80} -230 q 22 14 44 -4 M ${120} -200 l 80 -12`} stroke="rgba(0,0,0,0.3)" strokeWidth={5} fill="none" />
      {/* route board */}
      <rect x={-260} y={-Hh - 70} width={520} height={74} rx={12} fill="#141414" stroke={stripe} strokeWidth={5} />
      <text x={0} y={-Hh - 20} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#ffd35a">{route}</text>
      {/* lights */}
      <rect x={L / 2 - 16} y={-150} width={16} height={40} fill="#fff1a8" />
      <rect x={-L / 2} y={-150} width={16} height={40} fill="#ff4d5e" />
      <Tyre cx={-L / 2 + 210} cy={-60} r={68} roll={roll} />
      <Tyre cx={L / 2 - 230} cy={-60} r={68} roll={roll} />
      {/* exhaust */}
      {Array.from({length: 4}).map((_, k) => {
        const t = ((f + k * 9) % 36) / 36;
        return <circle key={k} cx={-L / 2 - 30 - t * 140} cy={-40 - t * 60} r={18 + t * 40} fill="#5d5d66" opacity={0.45 * (1 - t)} />;
      })}
    </g>
  );
};

/** Private car (side view, facing right). Length ≈ 520. */
export const Car: React.FC<{x: number; y: number; scale?: number; color?: string; shake?: number; roll?: number; driver?: string}> = ({
  x, y, scale = 1, color = '#e2483d', shake = 0, roll = 0, driver = '#d9a07a',
}) => {
  const f = useCurrentFrame();
  const jit = shake ? Math.sin(f * 2.3) * 3 * shake : 0;
  return (
    <g transform={`translate(${x + jit},${y}) scale(${scale})`}>
      <ellipse cx={0} cy={4} rx={280} ry={18} fill="rgba(0,0,0,0.28)" />
      <path d="M -260 -50 L -260 -120 Q -250 -150 -200 -155 L -120 -160 L -60 -235 Q -40 -250 0 -250 L 110 -250 Q 140 -250 160 -230 L 215 -165 Q 262 -158 262 -120 L 262 -50 Z" fill={color} stroke="rgba(0,0,0,0.3)" strokeWidth={5} />
      <path d="M -100 -162 L -50 -228 L 40 -228 L 40 -162 Z" fill="#a9dcf2" />
      <path d="M 58 -162 L 58 -228 L 110 -228 Q 128 -228 140 -214 L 182 -162 Z" fill="#a9dcf2" />
      <circle cx={10} cy={-190} r={22} fill={driver} />
      <path d="M -12 -196 Q 10 -222 32 -196" fill="#1f1712" />
      <rect x={240} y={-130} width={22} height={22} rx={4} fill="#fff1a8" />
      <rect x={-262} y={-128} width={16} height={22} fill="#ff4d5e" />
      <line x1={-160} y1={-110} x2={230} y2={-110} stroke="rgba(0,0,0,0.2)" strokeWidth={4} />
      <Tyre cx={-160} cy={-45} r={46} roll={roll} />
      <Tyre cx={170} cy={-45} r={46} roll={roll} />
    </g>
  );
};

/** Green CNG auto-rickshaw (side view, facing right). Length ≈ 380. */
export const Cng: React.FC<{x: number; y: number; scale?: number; roll?: number}> = ({x, y, scale = 1, roll = 0}) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x},${y + Math.sin(f * 1.3) * 1.2}) scale(${scale})`}>
      <ellipse cx={0} cy={4} rx={200} ry={14} fill="rgba(0,0,0,0.28)" />
      <path d="M -180 -45 L -180 -250 Q -180 -300 -120 -300 L 90 -300 Q 150 -300 175 -200 L 190 -45 Z" fill="#2fa25a" stroke="rgba(0,0,0,0.3)" strokeWidth={5} />
      <path d="M -150 -270 L 60 -270 L 60 -110 L -150 -110 Z" fill="#1f5d38" />
      {Array.from({length: 7}).map((_, i) => (
        <line key={i} x1={-150 + i * 35} y1={-270} x2={-150 + i * 35} y2={-110} stroke="#cfd6dc" strokeWidth={5} />
      ))}
      <path d="M 80 -280 L 140 -280 Q 160 -230 165 -170 L 80 -170 Z" fill="#a9dcf2" />
      <rect x={-180} y={-110} width={370} height={20} fill="#f2c14e" />
      <Tyre cx={-110} cy={-40} r={40} roll={roll} />
      <Tyre cx={140} cy={-40} r={40} roll={roll} />
    </g>
  );
};
