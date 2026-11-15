import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {H, W} from '../theme';

export const Sky: React.FC<{stops: string[]}> = ({stops}) => (
  <AbsoluteFill style={{background: `linear-gradient(180deg, ${stops.join(', ')})`}} />
);

export const Stars: React.FC<{count?: number; maxY?: number; opacity?: number; seed?: string}> = ({count = 60, maxY = 800, opacity = 0.7, seed = 'st'}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        {Array.from({length: count}).map((_, i) => {
          const x = random(`${seed}x${i}`) * W;
          const y = random(`${seed}y${i}`) * maxY;
          const r = 1 + random(`${seed}r${i}`) * 2.2;
          const tw = 0.5 + 0.5 * Math.sin(f * 0.12 + i * 1.7);
          return <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={opacity * (0.35 + 0.65 * tw)} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

export const Moon: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 70}) => (
  <AbsoluteFill>
    <svg width={W} height={H}>
      <defs>
        <radialGradient id="moonGlow">
          <stop offset="0%" stopColor="rgba(255,244,214,0.55)" />
          <stop offset="100%" stopColor="rgba(255,244,214,0)" />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r * 3.2} fill="url(#moonGlow)" />
      <circle cx={x} cy={y} r={r} fill="#fff4d6" />
      <circle cx={x - r * 0.3} cy={y - r * 0.2} r={r * 0.16} fill="#eadfbe" />
      <circle cx={x + r * 0.35} cy={y + r * 0.25} r={r * 0.12} fill="#eadfbe" />
      <circle cx={x + r * 0.1} cy={y - r * 0.45} r={r * 0.08} fill="#eadfbe" />
    </svg>
  </AbsoluteFill>
);

export const Sun: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 90}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <g transform={`translate(${x},${y}) rotate(${f * 0.3})`}>
          {Array.from({length: 12}).map((_, i) => (
            <rect key={i} x={-6} y={-r * 1.9} width={12} height={r * 0.55} rx={6} fill="#fff3b0" opacity={0.7} transform={`rotate(${i * 30})`} />
          ))}
        </g>
        <circle cx={x} cy={y} r={r * 1.35} fill="rgba(255,240,170,0.35)" />
        <circle cx={x} cy={y} r={r} fill="#ffe27a" />
      </svg>
    </AbsoluteFill>
  );
};
