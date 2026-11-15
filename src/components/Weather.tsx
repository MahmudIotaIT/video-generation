import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {H, W} from '../theme';
import {flashIntensity} from '../lib/anim';

export const Rain: React.FC<{count?: number; opacity?: number}> = ({count = 140, opacity = 0.5}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={W} height={H}>
        {Array.from({length: count}).map((_, i) => {
          const x0 = random(`rx${i}`) * (W + 400) - 100;
          const sp = 38 + random(`rs${i}`) * 22;
          const len = 40 + random(`rl${i}`) * 50;
          const y = ((random(`ry${i}`) * H + f * sp) % (H + 200)) - 100;
          const x = x0 - y * 0.18;
          return (
            <line key={i} x1={x} y1={y} x2={x - len * 0.18} y2={y + len} stroke="#b9d6ff"
              strokeOpacity={opacity * (0.4 + random(`ro${i}`) * 0.6)} strokeWidth={2.2} strokeLinecap="round" />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

export const Fog: React.FC<{opacity: number; top?: number; height?: number; rgb?: string}> = ({opacity, top = 700, height = 700, rgb = '200,215,235'}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
      {[0, 1, 2, 3, 4].map((i) => {
        const w = 1300 + i * 140;
        const x = -260 + Math.sin(f / 80 + i * 1.7) * 160 - i * 40;
        const y = top + (i % 3) * height * 0.25 - 60;
        return (
          <div key={i} style={{
            position: 'absolute', left: x, top: y, width: w, height: height * 0.6,
            background: `radial-gradient(ellipse at center, rgba(${rgb},0.55) 0%, rgba(${rgb},0.25) 40%, rgba(${rgb},0) 70%)`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

const Cloud: React.FC<{x: number; y: number; s: number; color: string}> = ({x, y, s, color}) => (
  <g transform={`translate(${x},${y}) scale(${s})`} fill={color}>
    <circle cx={0} cy={0} r={60} />
    <circle cx={70} cy={-35} r={75} />
    <circle cx={150} cy={-10} r={62} />
    <circle cx={215} cy={10} r={45} />
    <rect x={-55} y={0} width={310} height={55} rx={27} />
  </g>
);

export const CloudLayer: React.FC<{seed: string; count: number; yMin: number; yMax: number; color: string; speed?: number; scale?: number; opacity?: number}> = ({
  seed, count, yMin, yMax, color, speed = 1, scale = 1.5, opacity = 1,
}) => {
  const f = useCurrentFrame();
  const span = W + 1600;
  return (
    <AbsoluteFill style={{opacity}}>
      <svg width={W} height={H}>
        {Array.from({length: count}).map((_, i) => {
          const base = random(`${seed}cx${i}`) * span;
          const x = ((base + f * speed * (0.7 + random(`${seed}cs${i}`) * 0.6)) % span) - 800;
          const y = yMin + random(`${seed}cy${i}`) * (yMax - yMin);
          const s = scale * (0.7 + random(`${seed}cz${i}`) * 0.6);
          return <Cloud key={i} x={x} y={y} s={s} color={color} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

const boltPath = (seed: string, x: number, y0: number, y1: number) => {
  let d = `M ${x} ${y0}`;
  let cx = x;
  const n = 9;
  for (let i = 1; i <= n; i++) {
    cx += (random(`${seed}-${i}`) - 0.5) * 90;
    d += ` L ${cx.toFixed(1)} ${(y0 + ((y1 - y0) * i) / n).toFixed(1)}`;
  }
  return d;
};

export const Lightning: React.FC<{strikes: number[]; y0?: number; y1?: number}> = ({strikes, y0 = 150, y1 = 1000}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={W} height={H}>
        <defs>
          <filter id="boltGlow" x="-50%" y="-10%" width="200%" height="120%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        {strikes.map((s, i) => {
          const v = flashIntensity(f, [s]);
          if (v < 0.05) return null;
          const x = 150 + random(`bx${s}-${i}`) * (W - 300);
          const d = boltPath(`b${s}`, x, y0, y1 * (0.7 + random(`by${s}`) * 0.3));
          return (
            <g key={i} opacity={v}>
              <path d={d} stroke="#9fd8ff" strokeWidth={22} fill="none" filter="url(#boltGlow)" />
              <path d={d} stroke="#ffffff" strokeWidth={5} fill="none" strokeLinejoin="round" />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

export const Flash: React.FC<{strikes: number[]; max?: number}> = ({strikes, max = 0.5}) => {
  const f = useCurrentFrame();
  const v = flashIntensity(f, strikes) * max;
  if (v < 0.01) return null;
  return <AbsoluteFill style={{background: '#dff1ff', opacity: v, mixBlendMode: 'screen', pointerEvents: 'none'}} />;
};

export const Seagulls: React.FC<{count?: number}> = ({count = 4}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        {Array.from({length: count}).map((_, i) => {
          const x = ((random(`g${i}`) * W + f * (2 + i * 0.4)) % (W + 200)) - 100;
          const y = 380 + random(`gy${i}`) * 300 + Math.sin(f / 20 + i) * 15;
          const flap = 0.6 + 0.4 * Math.sin(f * 0.35 + i * 2);
          return (
            <path key={i} d="M -30 0 Q -15 -15 0 0 Q 15 -15 30 0" transform={`translate(${x},${y}) scale(1,${flap})`}
              stroke="#2b3a4f" strokeWidth={5} fill="none" strokeLinecap="round" />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
