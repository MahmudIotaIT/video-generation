import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS, FONT, W} from '../theme';
import {pointOnPolyline} from '../lib/anim';

const MAP = {lonMin: -87, latMax: 38, latMin: 13, kx: W / 28, ky: (W / 28) * 1.1};
export const MAP_H = Math.round((MAP.latMax - MAP.latMin) * MAP.ky);
export const proj = (lon: number, lat: number): [number, number] => [(lon - MAP.lonMin) * MAP.kx, (MAP.latMax - lat) * MAP.ky];

type LL = [number, number];
const poly = (pts: LL[]) =>
  pts.map(([lo, la], i) => {
    const [x, y] = proj(lo, la);
    return `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ') + ' Z';

const LAND: LL[][] = [
  [[-88, 39], [-74.9, 38.9], [-75.2, 38.0], [-75.8, 36.8], [-75.5, 35.2], [-76.6, 34.7], [-77.9, 33.9], [-79.2, 33.2], [-80.0, 32.6], [-81.0, 31.8], [-81.4, 30.7], [-81.3, 29.6], [-80.6, 28.4], [-80.1, 26.9], [-80.1, 25.9], [-80.4, 25.2], [-81.1, 25.1], [-81.7, 25.9], [-82.1, 26.6], [-82.7, 27.6], [-82.7, 28.6], [-83.6, 29.9], [-84.4, 30.0], [-85.4, 29.7], [-86.5, 30.4], [-88, 30.4]],
  [[-84.9, 21.9], [-84.0, 22.7], [-82.5, 23.1], [-81.0, 23.1], [-79.5, 22.4], [-77.5, 21.6], [-75.6, 21.0], [-74.2, 20.2], [-74.5, 20.0], [-77.0, 19.9], [-77.7, 20.7], [-78.5, 21.5], [-80.5, 22.0], [-81.8, 22.2], [-82.8, 22.6], [-84.4, 21.8]],
  [[-74.4, 19.9], [-72.8, 19.9], [-71.6, 19.8], [-70.0, 19.6], [-69.0, 19.0], [-68.4, 18.6], [-69.0, 18.4], [-70.5, 18.2], [-71.4, 17.6], [-72.0, 18.1], [-73.4, 18.2], [-74.4, 18.4], [-73.0, 18.6], [-72.7, 19.1], [-73.4, 19.6]],
  [[-67.25, 18.5], [-65.6, 18.4], [-65.6, 18.0], [-67.2, 17.95]],
  [[-78.3, 18.4], [-76.8, 18.5], [-76.2, 18.0], [-77.2, 17.7], [-78.3, 18.2]],
];
const ISLANDS: [number, number, number, number, number][] = [
  [-77.8, 24.3, 14, 34, 20], [-77.4, 25.1, 8, 14, 0], [-78.5, 26.6, 34, 8, -10], [-77.1, 26.5, 10, 26, 25],
  [-76.2, 24.9, 6, 30, 30], [-75.8, 23.6, 6, 18, 40], [-73.7, 21.1, 18, 10, 0], [-81.4, 24.7, 22, 4, -15],
];
export const PTS = {bermuda: proj(-64.78, 32.3), miami: proj(-80.19, 25.76), sanjuan: proj(-66.1, 18.47)};
const LANES: LL[][] = [
  [[-80.0, 25.0], [-79.6, 27.5], [-78, 31], [-74, 35], [-68, 38]],
  [[-81.5, 24.3], [-76, 23.6], [-73.5, 20.5], [-72, 18], [-70, 14]],
  [[-79.8, 26.5], [-72, 28.5], [-64, 31], [-59, 33]],
  [[-66, 18.6], [-67, 24], [-70, 30], [-73, 36]],
  [[-87, 24], [-82, 24.3], [-79.9, 25.5], [-79.5, 30], [-76.5, 35.5]],
];

const Pin: React.FC<{x: number; y: number; p: number; label: string; dx: number; dy: number; color: string; anchor?: 'start' | 'end' | 'middle'}> = ({
  x, y, p, label, dx, dy, color, anchor = 'middle',
}) => {
  const f = useCurrentFrame();
  if (p <= 0) return null;
  const q = Math.min(p, 1);
  const ring = (f % 40) / 40;
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r={10 + ring * 44} fill="none" stroke={color} strokeOpacity={(1 - ring) * 0.8 * q} strokeWidth={4} />
      <g transform={`translate(0,${(1 - q) * -120}) scale(${p})`}>
        <path d="M 0 0 C -6 -14, -26 -30, -26 -52 A 26 26 0 1 1 26 -52 C 26 -30, 6 -14, 0 0 Z" fill={color} stroke="#fff" strokeWidth={4} />
        <circle cx={0} cy={-52} r={10} fill="#fff" />
      </g>
      <text x={dx} y={dy} opacity={q} fontFamily={FONT} fontWeight={700} fontSize={40} fill="#fff" stroke="rgba(0,0,0,0.8)"
        strokeWidth={9} paintOrder="stroke" textAnchor={anchor}>{label}</text>
    </g>
  );
};

export const MapView: React.FC<{pins?: number[]; tri?: number; triFill?: number; triOpacity?: number; lanes?: number; labels?: number; bright?: number; oceanLabel?: number}> = ({
  pins = [0, 0, 0], tri = 0, triFill = 0, triOpacity = 1, lanes = 0, labels = 1, bright = 0, oceanLabel = 0,
}) => {
  const f = useCurrentFrame();
  const {bermuda: B, miami: M, sanjuan: S} = PTS;
  const triD = `M ${M[0]} ${M[1]} L ${B[0]} ${B[1]} L ${S[0]} ${S[1]} Z`;
  const perim = Math.hypot(B[0] - M[0], B[1] - M[1]) + Math.hypot(S[0] - B[0], S[1] - B[1]) + Math.hypot(M[0] - S[0], M[1] - S[1]);
  const pulse = 0.5 + 0.5 * Math.sin(f / 6);
  const label = (lon: number, lat: number, text: string, size = 30) => {
    const [x, y] = proj(lon, lat);
    return <text x={x} y={y} opacity={labels} fontFamily={FONT} fontWeight={600} fontSize={size} fill="#3a3020" textAnchor="middle">{text}</text>;
  };
  const [ox, oy] = proj(-69, 36);
  return (
    <svg width={W} height={MAP_H} viewBox={`0 0 ${W} ${MAP_H}`}>
      <defs>
        <linearGradient id="mapSea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c2f57" />
          <stop offset="100%" stopColor="#082040" />
        </linearGradient>
        <filter id="mapGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="9" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width={W} height={MAP_H} fill="url(#mapSea)" />
      <rect width={W} height={MAP_H} fill="#3d9ad6" opacity={bright * 0.55} />
      {[-85, -80, -75, -70, -65, -60].map((lo) => {
        const [x] = proj(lo, 0);
        return <line key={lo} x1={x} y1={0} x2={x} y2={MAP_H} stroke="rgba(255,255,255,0.08)" strokeWidth={2} />;
      })}
      {[15, 20, 25, 30, 35].map((la) => {
        const [, y] = proj(0, la);
        return <line key={la} x1={0} y1={y} x2={W} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth={2} />;
      })}
      {LAND.map((p, i) => <path key={`s${i}`} d={poly(p)} fill="rgba(0,0,0,0.3)" transform="translate(6,8)" />)}
      {LAND.map((p, i) => <path key={i} d={poly(p)} fill={COLORS.land} stroke={COLORS.landEdge} strokeWidth={2.5} strokeLinejoin="round" />)}
      {ISLANDS.map(([lo, la, rx, ry, rot], i) => {
        const [x, y] = proj(lo, la);
        return <ellipse key={i} cx={x} cy={y} rx={rx * 0.6} ry={ry * 0.6} fill={COLORS.land} transform={`rotate(${rot} ${x} ${y})`} />;
      })}
      {label(-79.2, 21.0, 'কিউবা', 28)}
      {label(-75.3, 25.9, 'বাহামা', 26)}
      <text x={ox} y={oy} opacity={oceanLabel} fontFamily={FONT} fontWeight={600} fontSize={40} fill="rgba(180,225,255,0.85)" textAnchor="middle">আটলান্টিক মহাসাগর</text>
      {lanes > 0 &&
        LANES.map((lane, i) => {
          const pts = lane.map(([lo, la]) => proj(lo, la));
          const d = pts.map(([x, y], k) => `${k ? 'L' : 'M'} ${x} ${y}`).join(' ');
          return (
            <g key={i} opacity={lanes}>
              <path d={d} stroke="rgba(255,255,255,0.35)" strokeWidth={3} fill="none" strokeDasharray="10 12" />
              {[0, 1, 2, 3].map((k) => {
                const [x, y] = pointOnPolyline(pts, (f * 0.004 * (1 + i * 0.15) + k / 4) % 1);
                return <circle key={k} cx={x} cy={y} r={8} fill="#fff" stroke="#38e8ff" strokeWidth={3} />;
              })}
            </g>
          );
        })}
      <g opacity={triOpacity}>
        <path d={triD} fill={`rgba(56,232,255,${0.2 * triFill})`} stroke="none" />
        <path d={triD} fill="none" stroke={COLORS.glow} strokeWidth={14} strokeOpacity={0.35 * pulse * triFill} strokeLinejoin="round" />
        <path d={triD} fill="none" stroke={COLORS.glow} strokeWidth={6} strokeLinejoin="round" strokeDasharray={perim} strokeDashoffset={perim * (1 - tri)} filter="url(#mapGlow)" />
      </g>
      <Pin x={B[0]} y={B[1]} p={pins[0]} label="বারমুডা" dx={0} dy={-100} color="#ff4d5e" />
      <Pin x={M[0]} y={M[1]} p={pins[1]} label="ফ্লোরিডা" dx={-34} dy={-70} color="#ffb020" anchor="end" />
      <Pin x={S[0]} y={S[1]} p={pins[2]} label="পুয়ের্তো রিকো" dx={0} dy={60} color="#9b5cff" />
    </svg>
  );
};
