import React from 'react';
import {useCurrentFrame} from 'remotion';
import {AngerMark, KarimHead, RumanaHead, Steam, SweatDrops, ik, type Mood} from './Characters';

export type KarimPose = 'ride' | 'point' | 'wave' | 'shrug' | 'offer';
export type RumanaPose = 'sit' | 'fist' | 'phone' | 'watch' | 'point' | 'hands';

export type RickshawProps = {
  x: number;
  y: number;
  scale?: number;
  /** wheel rotation in degrees (grows as it moves) */
  roll?: number;
  /** pedal crank angle in radians */
  pedal?: number;
  karim?: {mood: Mood; talking: boolean; pose?: KarimPose; look?: number};
  rumana?: {mood: Mood; talking: boolean; pose?: RumanaPose; look?: number; fx?: 'anger' | 'sweat' | 'steam' | null} | null;
  /** 0..1 cartoon wings (daydream) */
  wings?: number;
  /** extra bounce in px */
  bob?: number;
  idPrefix: string;
};

const Wheel: React.FC<{cx: number; cy: number; r: number; roll: number}> = ({cx, cy, r, roll}) => (
  <g transform={`translate(${cx},${cy})`}>
    <circle r={r} fill="none" stroke="#1b1b1f" strokeWidth={r * 0.16} />
    <circle r={r * 0.9} fill="none" stroke="#c8ccd4" strokeWidth={r * 0.05} />
    <g transform={`rotate(${roll})`}>
      {Array.from({length: 12}).map((_, i) => (
        <line key={i} x1={0} y1={0} x2={Math.cos((i * Math.PI) / 6) * r * 0.88} y2={Math.sin((i * Math.PI) / 6) * r * 0.88} stroke="#d9dde4" strokeWidth={3} />
      ))}
      <circle cx={r * 0.62} cy={0} r={r * 0.07} fill="#ff5a7a" />
    </g>
    <circle r={r * 0.14} fill="#9aa1ad" stroke="#5b616b" strokeWidth={3} />
  </g>
);

const Line2: React.FC<{a: [number, number]; b: [number, number]; c: [number, number]; w: number; color: string}> = ({a, b, c, w, color}) => (
  <polyline points={`${a[0]},${a[1]} ${b[0]},${b[1]} ${c[0]},${c[1]}`} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
);

export const Rickshaw: React.FC<RickshawProps> = ({x, y, scale = 1, roll = 0, pedal = 0, karim, rumana, wings = 0, bob = 0, idPrefix}) => {
  const f = useCurrentFrame();
  const kar = karim ?? {mood: 'calm' as Mood, talking: false};
  const kPose = kar.pose ?? 'ride';
  const breathe = Math.sin(f / 14) * 2;
  const crank: [number, number] = [60, -140];
  const cr = 36;
  const foot = (a: number): [number, number] => [crank[0] + Math.cos(a) * cr, crank[1] + Math.sin(a) * cr];
  const kHip: [number, number] = [118, -350];
  const kShoulder: [number, number] = [176, -492 + breathe];
  const kHead: [number, number] = [196, -566 + breathe];
  const talkNod = kar.talking ? Math.sin(f * 0.4) * 3 : 0;

  const kHand: [number, number] = (() => {
    switch (kPose) {
      case 'point': return [330, -470];
      case 'wave': return [255, -690 + Math.sin(f * 0.5) * 18];
      case 'shrug': return [312, -585];
      case 'offer': return [60, -470];
      default: return [284, -362];
    }
  })();
  const kElbow = ik(kShoulder, kHand, 92, 92, kPose === 'ride' || kPose === 'shrug' ? 1 : -1);
  const kFarHand: [number, number] = kPose === 'shrug' ? [95, -600] : [276, -356];
  const kFarElbow = ik([160, -488], kFarHand, 92, 92, 1);

  const rum = rumana;
  const rPose = rum?.pose ?? 'sit';
  const rShoulder: [number, number] = [-184, -462 + breathe];
  const shake = Math.sin(f * 0.9) * 10;
  const rHand: [number, number] = (() => {
    switch (rPose) {
      case 'fist': return [-95 + shake, -600];
      case 'phone': return [-70, -545];
      case 'watch': return [-105, -430];
      case 'point': return [-15, -500];
      case 'hands': return [-90, -560 + Math.sin(f * 0.35) * 14];
      default: return [-110, -340];
    }
  })();
  const rElbow = ik(rShoulder, rHand, 82, 82, rPose === 'sit' ? -1 : 1);

  const wingFlap = Math.sin(f * 0.55) * 25;
  const kLook = kar.look ?? 0;

  return (
    <g transform={`translate(${x},${y + bob}) scale(${scale})`}>
      <defs>
        <linearGradient id={`${idPrefix}hood`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3a2a7a" />
          <stop offset="100%" stopColor="#24185a" />
        </linearGradient>
      </defs>
      <ellipse cx={30} cy={2} rx={360} ry={22} fill="rgba(0,0,0,0.28)" />

      {wings > 0 && (
        <g opacity={wings} transform="translate(-200,-560)">
          {[0, 1].map((k) => (
            <g key={k} transform={`rotate(${-20 - wingFlap - k * 12}) scale(${(1 - k * 0.15) * wings})`}>
              <path d="M 0 0 C -60 -120 -220 -170 -330 -130 C -260 -100 -270 -60 -300 -40 C -230 -40 -230 -10 -250 10 C -170 10 -90 20 0 0 Z" fill={k ? '#e7eefc' : '#ffffff'} stroke="#b7c3dc" strokeWidth={5} />
            </g>
          ))}
        </g>
      )}

      {/* far-side pedal leg (darker) */}
      {(() => {
        const ft = foot(pedal + Math.PI);
        const kn = ik(kHip, ft, 128, 128, -1);
        return <Line2 a={kHip} b={kn} c={ft} w={30} color="#7a4c30" />;
      })()}

      {/* hood interior + passenger area */}
      <path d="M -335 -300 C -350 -560 -250 -680 -120 -672 C -60 -668 -20 -640 -10 -600 L -30 -300 Z" fill="#2a1c46" />

      {/* rear wheel + mudguard */}
      <Wheel cx={-170} cy={-115} r={115} roll={roll} />
      <path d="M -300 -120 A 132 132 0 0 1 -40 -150" stroke="#e8b63a" strokeWidth={14} fill="none" />
      <rect x={-312} y={-128} width={26} height={70} rx={6} fill="#e64a8a" />

      {/* frame */}
      <g stroke="#2e3a8c" strokeWidth={14} strokeLinecap="round" fill="none">
        <path d="M -170 -115 L 40 -200 L 60 -140 Z" />
        <path d="M -40 -250 L 240 -300" />
        <path d="M 60 -140 L 118 -330" />
        <path d="M 240 -305 L 250 -78" />
        <path d="M 240 -300 L 262 -365" />
      </g>
      <line x1={60} y1={-140} x2={-170} y2={-115} stroke="#333" strokeWidth={5} />
      <line x1={60} y1={-104} x2={-170} y2={-100} stroke="#333" strokeWidth={5} />
      <circle cx={crank[0]} cy={crank[1]} r={22} fill="#8a909c" stroke="#3f444c" strokeWidth={4} />

      {/* front wheel + mudguard */}
      <Wheel cx={250} cy={-78} r={78} roll={roll * 1.5} />
      <path d="M 165 -95 A 90 90 0 0 1 330 -110" stroke="#e8b63a" strokeWidth={12} fill="none" />

      {/* seat box (painted panel) */}
      <rect x={-340} y={-310} width={300} height={112} rx={16} fill="#e63973" stroke="#ffd35a" strokeWidth={6} />
      {[-300, -240, -180, -120].map((cx, i) => (
        <g key={cx} transform={`translate(${cx},-254)`}>
          {Array.from({length: 6}).map((_, p) => (
            <ellipse key={p} cx={0} cy={-14} rx={9} ry={15} fill={['#ffd35a', '#7ee0e0', '#a3f07a', '#ffffff'][i]} transform={`rotate(${p * 60})`} />
          ))}
          <circle r={8} fill="#2a1c46" />
        </g>
      ))}
      <rect x={-345} y={-330} width={290} height={30} rx={14} fill="#c62828" />
      <rect x={-90} y={-205} width={140} height={16} rx={6} fill="#6b4a2a" />

      {/* driver saddle + handlebar */}
      <rect x={88} y={-352} width={70} height={20} rx={10} fill="#3b2a1e" />
      <line x1={250} y1={-365} x2={300} y2={-362} stroke="#2b2b2b" strokeWidth={12} strokeLinecap="round" />
      <circle cx={262} cy={-378} r={10} fill="#ffd35a" stroke="#a37b16" strokeWidth={3} />

      {/* Rumana (passenger) */}
      {rum && (
        <g>
          {/* legs: thigh forward, shin down */}
          <Line2 a={[-200, -318]} b={[-80, -322]} c={[-62, -210]} w={46} color="#f1efe6" />
          <ellipse cx={-50} cy={-202} rx={26} ry={10} fill="#b8325a" />
          {/* far arm resting */}
          <Line2 a={[-200, -455]} b={[-215, -380]} c={[-150, -338]} w={22} color="#a8235a" />
          {/* kameez torso */}
          <path d="M -238 -470 Q -186 -488 -140 -470 L -122 -330 Q -60 -330 -60 -300 L -250 -300 Q -258 -400 -238 -470 Z" fill="#d6336c" />
          <path d="M -230 -440 L -130 -440 M -236 -400 L -126 -400" stroke="#ffd35a" strokeWidth={4} strokeDasharray="4 10" />
          {/* orna (scarf) */}
          <path d={`M -225 -470 Q -170 -430 -128 -472 Q -150 -420 -200 -400 Q -250 -380 ${-300 + Math.sin(f / 7) * 10} ${-420 + Math.sin(f / 5) * 8} Q -260 -440 -225 -470 Z`} fill="#22b5a8" />
          {/* handbag */}
          <rect x={-150} y={-372} width={74} height={52} rx={10} fill="#7a4b2a" />
          <path d="M -140 -372 Q -113 -400 -86 -372" stroke="#5a3418" strokeWidth={6} fill="none" />
          {/* neck + head */}
          <rect x={-196} y={-500} width={28} height={40} fill="#c99372" />
          <g transform={`translate(-178,${-540 + breathe})`}>
            <RumanaHead mood={rum.mood} talking={rum.talking} look={rum.look ?? 0} tilt={rPose === 'watch' ? 8 : rum.talking ? Math.sin(f * 0.3) * 3 : 0} />
          </g>
          {/* near arm */}
          <Line2 a={rShoulder} b={rElbow} c={rHand} w={24} color="#d6336c" />
          <circle cx={rHand[0]} cy={rHand[1]} r={15} fill="#e3b08a" />
          {rPose === 'watch' && <rect x={rHand[0] - 16} y={rHand[1] - 12} width={20} height={24} rx={5} fill="#f2c14e" stroke="#8a6a10" strokeWidth={3} />}
          {rPose === 'phone' && (
            <g transform={`translate(${rHand[0] + 6},${rHand[1] - 40})`}>
              <rect x={-22} y={-10} width={44} height={80} rx={9} fill="#1d2230" />
              <rect x={-17} y={-3} width={34} height={64} rx={5} fill="#7fd3ff" />
            </g>
          )}
          {rum.fx === 'anger' && <AngerMark x={-110} y={-620} s={1.1} />}
          {rum.fx === 'sweat' && <SweatDrops x={-105} y={-600} />}
          {rum.fx === 'steam' && <Steam x={-178} y={-640} />}
        </g>
      )}

      {/* hood outer band + decorations */}
      <path d="M -350 -300 C -366 -575 -255 -700 -120 -692 C -50 -688 -6 -650 6 -600 L -24 -590 C -36 -630 -70 -656 -122 -660 C -240 -664 -322 -560 -310 -300 Z" fill={`url(#${idPrefix}hood)`} />
      {['#ff5a7a', '#ffd35a', '#7ee0a1'].map((c, i) => (
        <path key={c} d={`M ${-344 + i * 12} -310 C ${-358 + i * 12} ${-565 + i * 10} ${-250} ${-686 + i * 12} ${-122} ${-678 + i * 12} C ${-60} ${-674 + i * 12} ${-22 + i * 2} ${-640 + i * 10} ${-8 - i * 6} ${-596 + i * 2}`} stroke={c} strokeWidth={6} fill="none" />
      ))}
      {Array.from({length: 7}).map((_, i) => {
        const tx = -40 - i * 26;
        const ty = -600 - (i * i) * 1.2 - i * 6;
        const sw = Math.sin(f / 6 + i) * 6;
        return (
          <g key={i}>
            <line x1={tx} y1={ty} x2={tx + sw} y2={ty + 46} stroke={['#ff5a7a', '#ffd35a', '#7ee0e0', '#a3f07a'][i % 4]} strokeWidth={5} />
            <circle cx={tx + sw} cy={ty + 50} r={7} fill={['#ff5a7a', '#ffd35a', '#7ee0e0', '#a3f07a'][i % 4]} />
          </g>
        );
      })}

      {/* Karim (puller) */}
      <g>
        <Line2 a={[160, -488]} b={kFarElbow} c={kFarHand} w={22} color="#8d5a39" />
        {/* torso: white vest */}
        <path d={`M ${kShoulder[0] - 34} ${kShoulder[1] - 8} Q ${kShoulder[0] + 10} ${kShoulder[1] - 22} ${kShoulder[0] + 36} ${kShoulder[1]} L ${kHip[0] + 34} ${kHip[1] + 6} L ${kHip[0] - 30} ${kHip[1] + 6} Z`} fill="#f4f1e8" />
        <path d={`M ${kShoulder[0] - 18} ${kShoulder[1] - 12} Q ${kShoulder[0] + 2} ${kShoulder[1] + 22} ${kShoulder[0] + 20} ${kShoulder[1] - 14}`} fill="#a86f4a" />
        {/* near pedal leg with lungi */}
        {(() => {
          const ft = foot(pedal);
          const kn = ik(kHip, ft, 128, 128, -1);
          return (
            <g>
              <line x1={kHip[0]} y1={kHip[1]} x2={kn[0]} y2={kn[1]} stroke="#2f7fb8" strokeWidth={50} strokeLinecap="round" />
              <line x1={kHip[0]} y1={kHip[1]} x2={kn[0]} y2={kn[1]} stroke="#4fb06d" strokeWidth={50} strokeLinecap="round" strokeDasharray="10 14" opacity={0.6} />
              <line x1={kn[0]} y1={kn[1]} x2={ft[0]} y2={ft[1]} stroke="#a86f4a" strokeWidth={26} strokeLinecap="round" />
              <ellipse cx={ft[0] + 10} cy={ft[1] + 6} rx={24} ry={9} fill="#3b2a1e" />
            </g>
          );
        })()}
        <rect x={kHip[0] - 40} y={kHip[1] - 18} width={84} height={36} rx={14} fill="#2f7fb8" />
        {/* gamchha on shoulder */}
        <path d={`M ${kShoulder[0] - 30} ${kShoulder[1] - 10} L ${kShoulder[0] + 10} ${kShoulder[1] - 14} L ${kShoulder[0] - 10} ${kShoulder[1] + 70} L ${kShoulder[0] - 30} ${kShoulder[1] + 64} Z`} fill="#d23c3c" opacity={0.9} />
        <rect x={kHead[0] - 14} y={kHead[1] + 40} width={28} height={36} fill="#8d5a39" />
        <g transform={`translate(${kHead[0]},${kHead[1] + talkNod})`}>
          <KarimHead mood={kar.mood} talking={kar.talking} look={kLook} tilt={kPose === 'shrug' ? -8 : 0} />
        </g>
        <Line2 a={kShoulder} b={kElbow} c={kHand} w={24} color="#a86f4a" />
        <circle cx={kHand[0]} cy={kHand[1]} r={15} fill="#a86f4a" />
        {kPose === 'offer' && (
          <g transform={`translate(${kHand[0]},${kHand[1] - 20})`}>
            <path d="M -26 -10 L 26 -10 L 0 60 Z" fill="#f0d9a0" stroke="#b08a3c" strokeWidth={4} />
            {[[-12, -16], [0, -22], [12, -15], [-4, -12]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={7} fill={['#e2b05a', '#c44', '#6b3', '#e2b05a'][i]} />)}
          </g>
        )}
      </g>
    </g>
  );
};

/** Rumana standing (scene 1): origin = feet. pose 'wave' hails the rickshaw, 'watch' checks the time. */
export const RumanaStanding: React.FC<{x: number; y: number; scale?: number; mood: Mood; talking: boolean; pose?: 'wave' | 'watch' | 'idle'; look?: number}> = ({
  x, y, scale = 1, mood, talking, pose = 'idle', look = 0,
}) => {
  const f = useCurrentFrame();
  const breathe = Math.sin(f / 14) * 2;
  const sh: [number, number] = [40, -560 + breathe];
  const hand: [number, number] = pose === 'wave' ? [120 + Math.sin(f * 0.5) * 16, -760] : pose === 'watch' ? [70, -470] : [60, -360];
  const el = ik(sh, hand, 95, 95, pose === 'idle' ? -1 : 1);
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <ellipse cx={0} cy={4} rx={110} ry={16} fill="rgba(0,0,0,0.25)" />
      {/* salwar legs */}
      <rect x={-38} y={-260} width={34} height={250} rx={14} fill="#f1efe6" />
      <rect x={4} y={-260} width={34} height={250} rx={14} fill="#e6e3d8" />
      <ellipse cx={-26} cy={-6} rx={30} ry={11} fill="#b8325a" />
      <ellipse cx={26} cy={-6} rx={30} ry={11} fill="#b8325a" />
      {/* far arm */}
      <polyline points={`-40,-555 -66,-450 -48,-360`} stroke="#a8235a" strokeWidth={24} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* kameez */}
      <path d="M -62 -575 Q 0 -595 62 -575 L 82 -230 Q 0 -215 -82 -230 Z" fill="#d6336c" />
      <path d="M -70 -270 Q 0 -255 70 -270" stroke="#ffd35a" strokeWidth={8} fill="none" />
      <path d="M -58 -480 L 58 -480 M -66 -400 L 66 -400" stroke="#ffd35a" strokeWidth={4} strokeDasharray="4 10" />
      {/* orna */}
      <path d={`M -55 -580 Q 0 -520 55 -580 Q 40 -500 -20 -470 Q -80 -440 ${-120 + Math.sin(f / 7) * 12} ${-330 + Math.sin(f / 5) * 10} Q -100 -470 -55 -580 Z`} fill="#22b5a8" />
      {/* bag */}
      <path d="M -60 -560 L -95 -380" stroke="#5a3418" strokeWidth={6} />
      <rect x={-140} y={-390} width={84} height={64} rx={12} fill="#7a4b2a" />
      <rect x={-14} y={-615} width={28} height={44} fill="#c99372" />
      <g transform={`translate(0,${-670 + breathe})`}>
        <RumanaHead mood={mood} talking={talking} look={look} tilt={pose === 'watch' ? 10 : 0} />
      </g>
      <polyline points={`${sh[0]},${sh[1]} ${el[0]},${el[1]} ${hand[0]},${hand[1]}`} stroke="#d6336c" strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={hand[0]} cy={hand[1]} r={16} fill="#e3b08a" />
      {pose === 'watch' && <rect x={hand[0] - 18} y={hand[1] - 14} width={22} height={26} rx={5} fill="#f2c14e" stroke="#8a6a10" strokeWidth={3} />}
    </g>
  );
};
