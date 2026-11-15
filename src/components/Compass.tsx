import React from 'react';
import {FONT} from '../theme';

export const Compass: React.FC<{cx: number; cy: number; r: number; angle: number}> = ({cx, cy, r, angle}) => (
  <g transform={`translate(${cx},${cy})`}>
    <circle r={r + 30} fill="#7a5a1e" />
    <circle r={r + 18} fill="#c9a24a" />
    <circle r={r} fill="#f5ecd2" />
    {Array.from({length: 72}).map((_, i) => {
      const long = i % 18 === 0 ? 34 : i % 2 === 0 ? 18 : 10;
      return <line key={i} x1={0} y1={-r + 6} x2={0} y2={-r + long} stroke="#5a4520" strokeWidth={i % 18 === 0 ? 5 : 2} transform={`rotate(${i * 5})`} />;
    })}
    {([['উ', 0], ['পূ', 90], ['দ', 180], ['প', 270]] as const).map(([l, a]) => {
      const rad = (a * Math.PI) / 180;
      return (
        <text key={l} x={Math.sin(rad) * (r - 72)} y={-Math.cos(rad) * (r - 72)} fontFamily={FONT} fontWeight={700}
          fontSize={r * 0.2} textAnchor="middle" dominantBaseline="central" fill={a === 0 ? '#d62839' : '#3a3020'}>
          {l}
        </text>
      );
    })}
    <g transform={`rotate(${angle})`}>
      <path d={`M 0 ${-r * 0.78} L ${r * 0.09} 0 L ${-r * 0.09} 0 Z`} fill="#e63946" />
      <path d={`M 0 ${r * 0.78} L ${r * 0.09} 0 L ${-r * 0.09} 0 Z`} fill="#3d4a5c" />
    </g>
    <circle r={r * 0.07} fill="#c9a24a" stroke="#7a5a1e" strokeWidth={4} />
    <path d={`M ${-r * 0.7} ${-r * 0.3} A ${r} ${r} 0 0 1 ${r * 0.3} ${-r * 0.75}`} stroke="rgba(255,255,255,0.5)" strokeWidth={14} fill="none" strokeLinecap="round" />
  </g>
);
