import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {FONT, H, W} from '../../theme';

/** Full-frame SVG wrapper so every scene composes <g> layers in one coordinate space (1080×1920). */
export const Stage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
    {children}
  </svg>
);

export const SkyGradient: React.FC<{id: string; stops: string[]}> = ({id, stops}) => (
  <>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        {stops.map((c, i) => (
          <stop key={i} offset={`${(i / Math.max(1, stops.length - 1)) * 100}%`} stopColor={c} />
        ))}
      </linearGradient>
    </defs>
    <rect x={-400} y={-400} width={W + 800} height={H + 800} fill={`url(#${id})`} />
  </>
);

export const SunDisc: React.FC<{x: number; y: number; r?: number; color?: string}> = ({x, y, r = 80, color = '#ffe27a'}) => {
  const f = useCurrentFrame();
  return (
    <g>
      <circle cx={x} cy={y} r={r * 1.7} fill={color} opacity={0.18} />
      <circle cx={x} cy={y} r={r * 1.3 + Math.sin(f / 10) * 4} fill={color} opacity={0.3} />
      <circle cx={x} cy={y} r={r} fill={color} />
    </g>
  );
};

/** Puffy cartoon clouds drifting slowly to the left. */
export const Clouds: React.FC<{seed: string; count?: number; yMin?: number; yMax?: number; speed?: number; color?: string; opacity?: number}> = ({
  seed, count = 4, yMin = 150, yMax = 500, speed = 0.4, color = '#ffffff', opacity = 0.9,
}) => {
  const f = useCurrentFrame();
  return (
    <g opacity={opacity}>
      {Array.from({length: count}).map((_, i) => {
        const span = W + 600;
        const x0 = random(`${seed}x${i}`) * span;
        const x = ((((x0 - f * speed * (0.6 + random(`${seed}v${i}`))) % span) + span) % span) - 300;
        const y = yMin + random(`${seed}y${i}`) * (yMax - yMin);
        const s = 0.7 + random(`${seed}s${i}`) * 0.8;
        return (
          <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
            <ellipse cx={0} cy={20} rx={150} ry={40} fill={color} />
            <circle cx={-70} cy={0} r={55} fill={color} />
            <circle cx={10} cy={-25} r={75} fill={color} />
            <circle cx={85} cy={5} r={50} fill={color} />
          </g>
        );
      })}
    </g>
  );
};

const PAINT = ['#f4d9a6', '#f2b8a2', '#bfe3c9', '#a9cfe8', '#f7e7b4', '#e8c0d8', '#d7d2c3', '#c9e0a5'];
const BILLBOARDS = ['মামার চা', 'ঝটপট কুরিয়ার', 'সুপার কোচিং', 'দ্রুত ডেলিভারি'];

type Building = {x: number; w: number; h: number; color: string; tank: boolean; ac: boolean; board: string | null; balcony: boolean; seed: string};

const buildings = (seed: string, from: number, to: number, hMin: number, hMax: number, boards: boolean): Building[] => {
  const out: Building[] = [];
  let x = from;
  let k = 0;
  while (x < to) {
    const r = (s: string) => random(`${seed}${s}${k}`);
    const w = 150 + r('w') * 120;
    out.push({
      x, w, h: hMin + r('h') * (hMax - hMin), color: PAINT[Math.floor(r('c') * PAINT.length)], tank: r('t') < 0.55, ac: r('a') < 0.6,
      board: boards && r('b') < 0.3 ? BILLBOARDS[Math.floor(r('bb') * BILLBOARDS.length)] : null, balcony: r('y') < 0.5, seed: `${seed}${k}`,
    });
    x += w + 6 + r('g') * 18;
    k++;
  }
  return out;
};

/** Dhaka-style skyline: a hazy back row + a detailed front row with windows, tanks, balconies and billboards. */
export const Skyline: React.FC<{seed: string; baseY: number; scroll?: number; night?: number; haze?: string}> = ({seed, baseY, scroll = 0, night = 0, haze = '#b9c7d8'}) => {
  const back = buildings(`${seed}b`, -500, W + 900, 380, 720, false);
  const front = buildings(`${seed}f`, -500, W + 900, 260, 560, true);
  const lit = (s: string) => night > 0.05 && random(s) < 0.55;
  return (
    <g>
      <g transform={`translate(${-scroll * 0.35},0)`}>
        {back.map((b) => (
          <g key={b.seed}>
            <rect x={b.x} y={baseY - b.h} width={b.w} height={b.h} fill={haze} />
            {b.tank && <rect x={b.x + b.w * 0.6} y={baseY - b.h - 34} width={36} height={34} rx={4} fill={haze} />}
          </g>
        ))}
        <rect x={-600} y={baseY - 380} width={W + 1600} height={380} fill={haze} opacity={0.35} />
      </g>
      <g transform={`translate(${-scroll},0)`}>
        {front.map((b) => {
          const top = baseY - b.h;
          const cols = Math.max(2, Math.floor((b.w - 30) / 46));
          const rows = Math.floor((b.h - 60) / 72);
          const gap = (b.w - cols * 30) / (cols + 1);
          return (
            <g key={b.seed}>
              <rect x={b.x} y={top} width={b.w} height={b.h} fill={b.color} stroke="rgba(0,0,0,0.18)" strokeWidth={3} />
              <rect x={b.x} y={top} width={b.w} height={14} fill="rgba(0,0,0,0.12)" />
              <rect x={b.x + b.w - 18} y={top} width={18} height={b.h} fill="rgba(0,0,0,0.08)" />
              {Array.from({length: rows}).map((_, r) =>
                Array.from({length: cols}).map((__, c) => {
                  const wx = b.x + gap + c * (30 + gap);
                  const wy = top + 40 + r * 72;
                  const on = lit(`${b.seed}w${r}_${c}`);
                  return (
                    <g key={`${r}_${c}`}>
                      <rect x={wx} y={wy} width={30} height={40} rx={3} fill={on ? '#ffd96a' : '#5d7088'} opacity={on ? 0.55 + 0.45 * night : 1} />
                      <line x1={wx + 15} y1={wy} x2={wx + 15} y2={wy + 40} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
                      {b.balcony && <rect x={wx - 6} y={wy + 40} width={42} height={8} fill="rgba(0,0,0,0.22)" />}
                    </g>
                  );
                }),
              )}
              {b.tank && (
                <g>
                  <rect x={b.x + 18} y={top - 52} width={56} height={52} rx={6} fill="#2f3a4a" />
                  <rect x={b.x + 18} y={top - 52} width={56} height={10} rx={4} fill="#45546a" />
                </g>
              )}
              {b.ac && <rect x={b.x + b.w - 60} y={top + 110} width={40} height={26} rx={3} fill="#e9eef3" stroke="#9aa6b2" strokeWidth={2} />}
              {b.board && (
                <g transform={`translate(${b.x + b.w / 2},${top - 30})`}>
                  <line x1={-50} y1={0} x2={-50} y2={30} stroke="#3b3b3b" strokeWidth={6} />
                  <line x1={50} y1={0} x2={50} y2={30} stroke="#3b3b3b" strokeWidth={6} />
                  <rect x={-105} y={-78} width={210} height={80} rx={8} fill="#d94848" stroke="#fff3d6" strokeWidth={5} />
                  <text x={0} y={-26} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#fff3d6">{b.board}</text>
                </g>
              )}
            </g>
          );
        })}
      </g>
      {night > 0 && <rect x={-600} y={-400} width={W + 1600} height={baseY + 400} fill="#1a1440" opacity={night * 0.35} />}
    </g>
  );
};

/** The famous Dhaka tangle of overhead wires between two poles. */
export const Wires: React.FC<{y: number; scroll?: number; color?: string}> = ({y, scroll = 0, color = '#1d1d24'}) => {
  const f = useCurrentFrame();
  const sway = Math.sin(f / 25) * 4;
  const poles = [-140, 520, 1180].map((p) => p - (scroll % 660));
  return (
    <g>
      {poles.map((px, i) => (
        <g key={i}>
          <rect x={px - 12} y={y - 40} width={24} height={760} fill="#8b8f97" />
          <rect x={px - 40} y={y - 30} width={80} height={12} fill="#6c7078" />
          <ellipse cx={px} cy={y + 30} rx={46} ry={26} fill={color} />
        </g>
      ))}
      {poles.slice(0, -1).map((px, i) =>
        Array.from({length: 6}).map((_, k) => {
          const x2 = poles[i + 1];
          const y0 = y - 20 + k * 9;
          const sag = 60 + k * 14 + sway * (k % 3);
          return <path key={`${i}-${k}`} d={`M ${px} ${y0} Q ${(px + x2) / 2} ${y0 + sag} ${x2} ${y0 + (k % 2) * 6}`} stroke={color} strokeWidth={3 + (k % 2)} fill="none" />;
        }),
      )}
    </g>
  );
};

/** Footpath + road. `scroll` moves the lane dashes (vehicles moving forward). */
export const Road: React.FC<{y: number; scroll?: number; dusk?: number}> = ({y, scroll = 0, dusk = 0}) => {
  const dash = ((scroll % 180) + 180) % 180;
  return (
    <g>
      <rect x={-600} y={y} width={W + 1200} height={70} fill="#b9b3a6" />
      {Array.from({length: 16}).map((_, i) => (
        <line key={i} x1={-600 + i * 120 - (scroll % 120)} y1={y} x2={-600 + i * 120 - (scroll % 120)} y2={y + 70} stroke="#a39d90" strokeWidth={4} />
      ))}
      <rect x={-600} y={y + 70} width={W + 1200} height={20} fill="#8d877b" />
      <rect x={-600} y={y + 90} width={W + 1200} height={H} fill="#545a66" />
      <rect x={-600} y={y + 90} width={W + 1200} height={30} fill="rgba(0,0,0,0.18)" />
      {Array.from({length: 14}).map((_, i) => (
        <rect key={i} x={-600 + i * 180 - dash} y={y + 470} width={100} height={14} rx={6} fill="#e9e4d4" opacity={0.85} />
      ))}
      {dusk > 0 && <rect x={-600} y={y} width={W + 1200} height={H} fill="#1a1440" opacity={dusk * 0.3} />}
    </g>
  );
};

export const GROUND = 1000; // building base / footpath top
export const LANE = 1290; // rickshaw lane (wheels touch here)

/** Sky + sun + clouds + skyline + wires + road in one call. */
export const Street: React.FC<{id: string; sky: string[]; sun?: {x: number; y: number; color?: string}; scroll?: number; night?: number; cloudColor?: string; haze?: string}> = ({
  id, sky, sun, scroll = 0, night = 0, cloudColor = '#ffffff', haze,
}) => (
  <>
    <SkyGradient id={`${id}sky`} stops={sky} />
    {sun && <SunDisc x={sun.x} y={sun.y} color={sun.color} />}
    <Clouds seed={`${id}c`} color={cloudColor} opacity={0.85 - night * 0.4} />
    <Skyline seed="dhaka" baseY={GROUND} scroll={scroll} night={night} haze={haze} />
    <Wires y={430} scroll={scroll} />
    <Road y={GROUND} scroll={scroll} dusk={night} />
  </>
);
