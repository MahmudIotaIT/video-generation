import React from 'react';

export type IconKind = 'storm' | 'wave' | 'current' | 'compass' | 'human';

export const Icon: React.FC<{kind: IconKind; size?: number; color?: string}> = ({kind, size = 44, color = '#fff'}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    {kind === 'storm' && (
      <>
        <path d="M14 30 a9 9 0 0 1 1 -18 a12 12 0 0 1 22 3 a8 8 0 0 1 -1 15 Z" fill={color} />
        <path d="M24 28 l-5 10 h6 l-3 9 l9 -13 h-6 l3 -6 Z" fill="#ffd166" />
      </>
    )}
    {kind === 'wave' && (
      <>
        <path d="M4 20 q6 -8 12 0 t12 0 t12 0 t12 0" stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M4 32 q6 -8 12 0 t12 0 t12 0 t12 0" stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7} />
      </>
    )}
    {kind === 'current' && (
      <>
        <path d="M6 36 C 16 10, 30 40, 42 14" stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M33 13 L42 14 L41 23" stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>
    )}
    {kind === 'compass' && (
      <>
        <circle cx={24} cy={24} r={18} stroke={color} strokeWidth={4} fill="none" />
        <path d="M24 10 L28 24 L20 24 Z" fill="#ff4d5e" />
        <path d="M24 38 L28 24 L20 24 Z" fill={color} />
      </>
    )}
    {kind === 'human' && (
      <>
        <circle cx={24} cy={15} r={8} fill={color} />
        <path d="M10 42 c0 -14 28 -14 28 0 Z" fill={color} />
        <text x={38} y={14} fontSize={16} fontWeight={700} fill="#ffd166">?</text>
      </>
    )}
  </svg>
);
