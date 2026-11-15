import React from 'react';
import {useCurrentFrame} from 'remotion';

export const Avenger: React.FC<{x: number; y: number; scale?: number; rot?: number; opacity?: number}> = ({x, y, scale = 1, rot = 0, opacity = 1}) => {
  const f = useCurrentFrame();
  const blade = Math.cos(f * 1.3) * 40;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${scale})`} opacity={opacity}>
      <path d="M -150 -6 L -172 -64 L -130 -60 L -108 -16 Z" fill="#3e5c87" />
      <ellipse cx={-138} cy={4} rx={36} ry={7} fill="#35507a" />
      <path d="M -150 -6 C -100 -24, 60 -32, 122 -20 L 150 -12 L 150 14 L 122 20 C 60 28, -100 16, -150 6 Z" fill="#4a6a96" />
      <path d="M -120 8 C -60 18, 60 22, 122 18 L 122 20 C 60 28, -100 16, -150 6 Z" fill="#b8c7da" />
      <path d="M -40 -24 C -18 -52, 66 -52, 96 -26 Z" fill="#a9d6ff" opacity={0.9} />
      <line x1={0} y1={-46} x2={0} y2={-25} stroke="#3e5c87" strokeWidth={3} />
      <line x1={40} y1={-48} x2={40} y2={-25} stroke="#3e5c87" strokeWidth={3} />
      <ellipse cx={14} cy={10} rx={96} ry={10} fill="#3b5880" />
      <circle cx={-62} cy={0} r={15} fill="#1d2f5a" />
      <path d="M -62 -10 L -59 -3 L -52 -3 L -58 2 L -55 9 L -62 5 L -69 9 L -66 2 L -72 -3 L -65 -3 Z" fill="#fff" />
      <rect x={120} y={-16} width={30} height={32} rx={8} fill="#2f4469" />
      <ellipse cx={156} cy={0} rx={6} ry={42} fill="rgba(210,220,235,0.3)" />
      <line x1={156} y1={-blade} x2={156} y2={blade} stroke="#1c1c1c" strokeWidth={5} strokeLinecap="round" />
    </g>
  );
};

export const Mariner: React.FC<{x: number; y: number; scale?: number; flip?: boolean; opacity?: number}> = ({x, y, scale = 1, flip = false, opacity = 1}) => {
  const f = useCurrentFrame();
  const blade = Math.cos(f * 1.2) * 30;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -scale : scale},${scale})`} opacity={opacity}>
      <path d="M -165 -12 L -190 -74 L -162 -74 L -142 -16 Z" fill="#55657e" />
      <path d="M -170 -10 C -120 -42, 80 -46, 170 -20 C 186 -10, 186 10, 166 20 L -130 22 C -160 15, -176 5, -170 -10 Z" fill="#6d7f99" />
      <path d="M -130 22 L 166 20 C 150 34, 40 40, -60 36 Z" fill="#3d4a5f" />
      <path d="M 110 -30 C 128 -44, 150 -38, 162 -24 Z" fill="#a9d6ff" />
      {[-80, -40, 0, 40].map((wx) => (
        <circle key={wx} cx={wx} cy={-6} r={6} fill="#a9d6ff" opacity={0.8} />
      ))}
      <path d="M -50 -38 L 0 -74 L 120 -66 L 40 -44 Z" fill="#58698a" />
      <ellipse cx={34} cy={-66} rx={42} ry={13} fill="#4a5a78" />
      <ellipse cx={78} cy={-66} rx={5} ry={32} fill="rgba(210,220,235,0.3)" />
      <line x1={78} y1={-66 - blade} x2={78} y2={-66 + blade} stroke="#1c1c1c" strokeWidth={4} />
    </g>
  );
};
