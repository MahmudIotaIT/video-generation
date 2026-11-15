import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {H, W} from '../theme';
import {wavePath} from '../lib/anim';

type OceanProps = {
  horizonY: number;
  colors: string[];
  roughness?: number;
  speed?: number;
  split?: number;
  foam?: boolean;
  children?: React.ReactNode;
};

export const Ocean: React.FC<OceanProps> = ({horizonY, colors, roughness = 1, speed = 1, split = 1, foam = true, children}) => {
  const f = useCurrentFrame();
  const n = colors.length;
  const layers = colors.map((color, i) => {
    const t = n === 1 ? 0 : i / (n - 1);
    const baseY = horizonY + Math.pow(t, 1.6) * (H - horizonY) * 0.8;
    return {
      color,
      t,
      d: wavePath({width: W, baseY, amp: (4 + t * 46) * roughness, length: 180 + t * 520, phase: f * 0.05 * speed * (0.6 + t) + i * 1.9, bottom: H + 40}),
    };
  });
  const draw = (l: (typeof layers)[number], i: number) => (
    <g key={i}>
      <path d={l.d} fill={l.color} />
      {foam && l.t > 0.2 && <path d={l.d} fill="none" stroke="rgba(220,240,255,0.16)" strokeWidth={3 + l.t * 4} />}
    </g>
  );
  return (
    <AbsoluteFill>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {layers.slice(0, split).map(draw)}
        {children}
        {layers.slice(split).map((l, i) => draw(l, i + split))}
      </svg>
    </AbsoluteFill>
  );
};
