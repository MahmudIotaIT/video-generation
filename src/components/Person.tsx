import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FONT} from '../theme';

export const Person: React.FC<{x: number; y: number; scale?: number; role: 'scientist' | 'navigator'; talking?: boolean; confused?: boolean}> = ({
  x, y, scale = 1, role, talking = false, confused = false,
}) => {
  const f = useCurrentFrame();
  const isSci = role === 'scientist';
  const blink = f % 90 < 4 ? 0.15 : 1;
  const mouth = talking ? 3 + 9 * Math.abs(Math.sin(f * 0.42)) : 3;
  const breathe = Math.sin(f / 16) * 3;
  const sway = Math.sin(f / 22) * 1.5;
  const armSwing = talking ? Math.sin(f * 0.18) * 8 : 0;
  const coat = isSci ? '#f3f6fb' : '#1f3a63';
  const coatShade = isSci ? '#d5dce8' : '#172c4b';
  const pants = isSci ? '#34495e' : '#14243d';
  const skin = '#d9a07a';
  const skinShade = '#c18661';
  const hair = isSci ? '#5b5b66' : '#2a1c14';
  const raise = isSci ? -130 : -55;

  return (
    <g transform={`translate(${x},${y}) scale(${scale}) rotate(${sway})`}>
      <ellipse cx={0} cy={0} rx={110} ry={18} fill="rgba(0,0,0,0.25)" />
      <rect x={-50} y={-170} width={40} height={165} rx={16} fill={pants} />
      <rect x={10} y={-170} width={40} height={165} rx={16} fill={pants} />
      <ellipse cx={-30} cy={-6} rx={34} ry={14} fill="#1a1a1a" />
      <ellipse cx={30} cy={-6} rx={34} ry={14} fill="#1a1a1a" />
      <g transform={`translate(0,${breathe * 0.3})`}>
        <g transform={`rotate(${10 + armSwing * 0.3}, -85, -360)`}>
          <rect x={-118} y={-365} width={40} height={170} rx={20} fill={coatShade} />
          <circle cx={-98} cy={-190} r={22} fill={skin} />
        </g>
        <rect x={-90} y={-380} width={180} height={230} rx={60} fill={coat} />
        {isSci ? (
          <>
            <path d="M -22 -378 L 0 -330 L 22 -378 Z" fill="#7fb3e0" />
            <path d="M -24 -376 L 0 -300 M 24 -376 L 0 -300" stroke={coatShade} strokeWidth={6} />
            <rect x={30} y={-300} width={36} height={40} rx={6} fill={coatShade} />
            <line x1={40} y1={-312} x2={40} y2={-296} stroke="#3d7bd9" strokeWidth={4} />
            <line x1={52} y1={-312} x2={52} y2={-296} stroke="#d9534f" strokeWidth={4} />
          </>
        ) : (
          <>
            <path d="M -30 -380 L 0 -345 L 30 -380 Z" fill="#f3f6fb" />
            {[-340, -300, -260].map((by) => <circle key={by} cx={0} cy={by} r={6} fill="#f2c14e" />)}
            <rect x={-90} y={-372} width={30} height={10} rx={4} fill="#f2c14e" />
            <rect x={60} y={-372} width={30} height={10} rx={4} fill="#f2c14e" />
          </>
        )}
        <g transform={`rotate(${raise + armSwing}, 85, -360)`}>
          <rect x={78} y={-365} width={40} height={150} rx={20} fill={coat} stroke={coatShade} strokeWidth={3} />
          <circle cx={98} cy={-210} r={22} fill={skin} />
          {isSci ? (
            <>
              <rect x={92} y={-205} width={12} height={70} rx={5} fill="#6b4f2a" />
              <circle cx={98} cy={-100} r={38} fill="rgba(180,230,255,0.35)" stroke="#3a3f4a" strokeWidth={8} />
            </>
          ) : (
            <g transform="translate(98,-170)">
              <rect x={-45} y={0} width={90} height={60} rx={8} fill="#e8d3a0" stroke="#b8975a" strokeWidth={4} />
              <path d="M -30 15 L 0 35 L 25 12" stroke="#c0392b" strokeWidth={4} fill="none" strokeDasharray="6 5" />
            </g>
          )}
        </g>
        <rect x={-20} y={-410} width={40} height={40} fill={skinShade} />
        <g transform="translate(0,-470)">
          <circle cx={-76} cy={10} r={16} fill={skinShade} />
          <circle cx={76} cy={10} r={16} fill={skinShade} />
          <circle r={78} fill={skin} />
          {isSci ? (
            <path d="M -78 -10 C -80 -70, -30 -95, 0 -92 C 40 -95, 82 -60, 78 -10 C 60 -45, 30 -55, 0 -50 C -30 -55, -60 -45, -78 -10 Z" fill={hair} />
          ) : (
            <>
              <path d="M -78 -20 C -70 -60, 70 -60, 78 -20 Z" fill={hair} />
              <rect x={-84} y={-92} width={168} height={52} rx={18} fill="#13284a" />
              <rect x={-84} y={-58} width={168} height={12} fill="#f3f6fb" />
              <path d="M -60 -44 Q 20 -20 95 -40 L 95 -46 L -60 -46 Z" fill="#0b1a33" />
              <circle cx={0} cy={-72} r={11} fill="#f2c14e" />
            </>
          )}
          <ellipse cx={-28} cy={0} rx={9} ry={11 * blink} fill="#1b1b1b" />
          <ellipse cx={28} cy={0} rx={9} ry={11 * blink} fill="#1b1b1b" />
          {isSci && (
            <>
              <circle cx={-28} cy={0} r={22} fill="rgba(255,255,255,0.15)" stroke="#2b2b2b" strokeWidth={4} />
              <circle cx={28} cy={0} r={22} fill="rgba(255,255,255,0.15)" stroke="#2b2b2b" strokeWidth={4} />
              <line x1={-6} y1={0} x2={6} y2={0} stroke="#2b2b2b" strokeWidth={4} />
            </>
          )}
          <path d={confused ? 'M -44 -34 L -14 -42' : 'M -44 -28 L -14 -30'} stroke="#2b1d16" strokeWidth={6} strokeLinecap="round" />
          <path d={confused ? 'M 14 -26 L 44 -24' : 'M 14 -30 L 44 -28'} stroke="#2b1d16" strokeWidth={6} strokeLinecap="round" />
          {!isSci && <path d="M -22 26 Q 0 18 22 26 Q 0 34 -22 26 Z" fill="#2a1c14" />}
          <ellipse cx={0} cy={40} rx={16} ry={mouth} fill="#7a2e2e" />
          <circle cx={-48} cy={24} r={11} fill="#e88a7a" opacity={0.4} />
          <circle cx={48} cy={24} r={11} fill="#e88a7a" opacity={0.4} />
        </g>
      </g>
      {confused &&
        [[-130, -650, 0], [120, -620, 1], [0, -720, 2]].map(([qx, qy, k]) => (
          <text key={k} x={qx} y={qy + Math.sin(f / 9 + k * 2) * 12} fontSize={90} fontWeight={700} fontFamily={FONT}
            fill="#ffcf5a" textAnchor="middle" opacity={0.6 + 0.4 * Math.sin(f / 7 + k)}>?</text>
        ))}
    </g>
  );
};
