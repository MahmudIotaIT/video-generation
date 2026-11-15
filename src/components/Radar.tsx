import React from 'react';
import {useCurrentFrame} from 'remotion';

export type Blip = {x: number; y: number; alpha: number};

export const Radar: React.FC<{cx: number; cy: number; r: number; blips: Blip[]; speed?: number}> = ({cx, cy, r, blips, speed = 4}) => {
  const f = useCurrentFrame();
  const ang = (f * speed) % 360;
  const a2 = (-40 * Math.PI) / 180;
  return (
    <g transform={`translate(${cx},${cy})`}>
      <defs>
        <radialGradient id="radarBg">
          <stop offset="0%" stopColor="#0a3d24" />
          <stop offset="100%" stopColor="#021208" />
        </radialGradient>
        <filter id="blipGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle r={r + 24} fill="#1b2a24" stroke="#3a4f45" strokeWidth={10} />
      <circle r={r} fill="url(#radarBg)" />
      {[0.25, 0.5, 0.75, 1].map((k) => (
        <circle key={k} r={r * k} fill="none" stroke="#1eff8e" strokeOpacity={0.3} strokeWidth={2} />
      ))}
      <line x1={-r} y1={0} x2={r} y2={0} stroke="#1eff8e" strokeOpacity={0.25} strokeWidth={2} />
      <line x1={0} y1={-r} x2={0} y2={r} stroke="#1eff8e" strokeOpacity={0.25} strokeWidth={2} />
      <g transform={`rotate(${ang})`}>
        <path d={`M 0 0 L ${r} 0 A ${r} ${r} 0 0 0 ${r * Math.cos(a2)} ${r * Math.sin(a2)} Z`} fill="rgba(30,255,142,0.22)" />
        <line x1={0} y1={0} x2={r} y2={0} stroke="#7dffb8" strokeWidth={4} />
      </g>
      {blips.map((b, i) =>
        b.alpha > 0.01 ? (
          <g key={i} opacity={b.alpha}>
            <circle cx={b.x} cy={b.y} r={13} fill="#9dffc9" filter="url(#blipGlow)" />
            <circle cx={b.x} cy={b.y} r={13 + ((f + i * 9) % 30)} fill="none" stroke="#9dffc9" strokeOpacity={1 - ((f + i * 9) % 30) / 30} strokeWidth={3} />
          </g>
        ) : null,
      )}
      <circle r={8} fill="#7dffb8" />
    </g>
  );
};
