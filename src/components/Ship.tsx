import React from 'react';
import {useCurrentFrame} from 'remotion';

export const Ship: React.FC<{x: number; y: number; scale?: number; rock?: number; opacity?: number; lights?: boolean; smoke?: boolean}> = ({
  x, y, scale = 1, rock = 1, opacity = 1, lights = false, smoke = true,
}) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 13) * 5 * rock;
  const rot = Math.sin(f / 19) * 2.5 * rock;
  const containers = ['#e8743b', '#2bb3a3', '#f2c14e', '#3d7bd9', '#d9534f', '#8e6bd6'];
  const blink = Math.floor(f / 15) % 2 === 0;
  return (
    <g transform={`translate(${x},${y + bob}) rotate(${rot}) scale(${scale})`} opacity={opacity}>
      {smoke &&
        Array.from({length: 6}).map((_, i) => {
          const p = (f * 0.6 + i * 18) % 110;
          return <circle key={i} cx={125 - p * 0.9} cy={-190 - p * 1.1} r={12 + p * 0.28} fill="#9aa4b5" opacity={0.45 * (1 - p / 110)} />;
        })}
      <path d="M -225 -40 L 250 -46 L 208 30 L -212 30 Z" fill="#1f2b45" />
      <path d="M -217 4 L 225 4 L 208 30 L -212 30 Z" fill="#b33a3a" />
      <rect x={-222} y={-46} width={466} height={7} fill="#e9edf5" />
      {[0, 1].map((row) =>
        Array.from({length: 6}).map((_, k) => (
          <rect key={`${row}-${k}`} x={-195 + k * 46} y={-86 - row * 40} width={42} height={38} rx={3}
            fill={containers[(k + row * 2) % containers.length]} stroke="rgba(0,0,0,0.25)" strokeWidth={2} />
        )),
      )}
      <rect x={95} y={-160} width={95} height={116} rx={6} fill="#eef2f7" />
      {[0, 1, 2, 3].map((k) => (
        <rect key={k} x={103 + k * 21} y={-148} width={15} height={14} rx={2} fill={lights ? '#ffe9a3' : '#7b8aa3'} />
      ))}
      {[0, 1, 2, 3].map((k) => (
        <rect key={`b${k}`} x={103 + k * 21} y={-118} width={15} height={12} rx={2} fill={lights ? '#ffd677' : '#8d9bb2'} />
      ))}
      <rect x={118} y={-198} width={32} height={40} rx={4} fill="#c0392b" />
      <rect x={118} y={-198} width={32} height={9} fill="#1b1b1b" />
      <line x1={70} y1={-46} x2={70} y2={-215} stroke="#2a344d" strokeWidth={5} />
      <circle cx={70} cy={-218} r={7} fill={lights && blink ? '#ff4d5e' : '#5a2a30'} />
      {lights && <circle cx={70} cy={-218} r={22} fill="rgba(255,77,94,0.25)" opacity={blink ? 1 : 0} />}
    </g>
  );
};
