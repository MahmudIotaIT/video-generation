import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../../theme';
import {ramp} from '../../lib/anim';
import {Face, SKIN, ik, type Mood} from './Characters';

/** Racing snail with a tiny helmet and a fluttering scarf. Facing right. */
export const Snail: React.FC<{x: number; y: number; scale?: number; smug?: boolean}> = ({x, y, scale = 1, smug = true}) => {
  const f = useCurrentFrame();
  const squish = 1 + Math.sin(f * 0.5) * 0.05;
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <ellipse cx={0} cy={4} rx={120} ry={12} fill="rgba(0,0,0,0.25)" />
      {/* speed lines */}
      {[0, 1, 2].map((k) => (
        <line key={k} x1={-220 - ((f * 6 + k * 30) % 60)} y1={-40 - k * 28} x2={-150 - ((f * 6 + k * 30) % 60)} y2={-40 - k * 28} stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.8} />
      ))}
      <path d={`M -110 0 Q -120 -30 -60 -36 L 90 -36 Q 140 -40 150 -80 Q 160 -130 125 -140 Q 95 -140 92 -95 L 90 -40 Z`} fill="#b8e07a" stroke="#6f9a3a" strokeWidth={5} transform={`scale(${squish},1)`} />
      {/* shell */}
      <g transform="translate(-20,-95)">
        <circle r={82} fill="#e0894a" stroke="#9c4f1f" strokeWidth={6} />
        <path d="M 0 0 m -8 0 a 8 8 0 1 1 16 0 a 20 20 0 1 1 -40 0 a 34 34 0 1 1 68 0 a 50 50 0 1 1 -100 0" stroke="#9c4f1f" strokeWidth={7} fill="none" />
      </g>
      {/* eye stalks */}
      <line x1={125} y1={-130} x2={115} y2={-190} stroke="#6f9a3a" strokeWidth={7} />
      <line x1={140} y1={-128} x2={160} y2={-185} stroke="#6f9a3a" strokeWidth={7} />
      <circle cx={115} cy={-195} r={14} fill="#fff" stroke="#6f9a3a" strokeWidth={3} />
      <circle cx={160} cy={-190} r={14} fill="#fff" stroke="#6f9a3a" strokeWidth={3} />
      <circle cx={120} cy={-195} r={6} fill="#222" />
      <circle cx={165} cy={-190} r={6} fill="#222" />
      {/* helmet + scarf */}
      <path d="M 92 -118 Q 125 -165 162 -118 Z" fill="#e23b3b" stroke="#8a1c1c" strokeWidth={4} />
      <path d={`M 98 -110 Q 60 ${-120 + Math.sin(f * 0.7) * 10} 20 ${-100 + Math.sin(f * 0.5) * 14} L 26 -88 Q 60 -100 100 -98 Z`} fill="#ffd35a" />
      <path d={smug ? 'M 120 -92 Q 135 -82 150 -96' : 'M 122 -90 Q 135 -86 148 -90'} stroke="#3a5a1a" strokeWidth={5} fill="none" strokeLinecap="round" />
    </g>
  );
};

/** Jhalmuri seller walking with a tin pot hung from his neck. Facing left. Origin = feet. */
export const Vendor: React.FC<{x: number; y: number; scale?: number; walk?: number; talking?: boolean; mood?: Mood}> = ({x, y, scale = 1, walk = 0, talking = false, mood = 'happy'}) => {
  const f = useCurrentFrame();
  const step = Math.sin(walk);
  const bob = Math.abs(Math.cos(walk)) * -8;
  const hip: [number, number] = [0, -230];
  const legA: [number, number] = [step * 50, 0];
  const legB: [number, number] = [-step * 50, 0];
  return (
    <g transform={`translate(${x},${y + bob}) scale(${scale})`}>
      <ellipse cx={0} cy={4} rx={90} ry={12} fill="rgba(0,0,0,0.25)" />
      {[legB, legA].map((ft, k) => {
        const kn = ik(hip, ft, 120, 118, 1);
        return <polyline key={k} points={`${hip[0]},${hip[1]} ${kn[0]},${kn[1]} ${ft[0]},${ft[1]}`} stroke={k ? '#e9e4d4' : '#cfc8b4'} strokeWidth={34} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
      })}
      <path d="M -60 -470 Q 0 -490 60 -470 L 70 -220 L -70 -220 Z" fill="#f6f3ea" />
      {/* strap + tin pot */}
      <path d="M -40 -470 L -20 -330 M 40 -470 L 20 -330" stroke="#7a4b2a" strokeWidth={6} />
      <g transform="translate(0,-300)">
        <rect x={-75} y={-40} width={150} height={100} rx={14} fill="#c9cdd4" stroke="#7d838c" strokeWidth={5} />
        <ellipse cx={0} cy={-40} rx={75} ry={16} fill="#e0c07a" />
        {[[-40, -44], [-10, -50], [20, -46], [45, -42], [0, -40]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={8} fill={['#c44', '#6b3', '#e2b05a', '#f0e0b0', '#c44'][i]} />)}
        <rect x={-75} y={10} width={150} height={14} fill="#d23c3c" />
      </g>
      {/* arm holding a paper cone out */}
      <polyline points={`-50,-450 -110,-380 -150,-420`} stroke={SKIN.vendor} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M -175 -450 L -125 -450 L -150 -380 Z" fill="#f0d9a0" stroke="#b08a3c" strokeWidth={4} />
      <rect x={-14} y={-505} width={28} height={36} fill={SKIN.vendor} />
      <g transform={`translate(0,-560) scale(-1,1)`}>
        <ellipse rx={54} ry={58} fill={SKIN.vendor} />
        <path d="M -56 -14 Q -52 -66 0 -68 Q 52 -66 56 -14 Q 30 -40 0 -40 Q -30 -40 -56 -14 Z" fill="#1f1712" />
        <path d="M -48 -40 Q 0 -90 48 -40 Z" fill="#f6f3ea" />
        <g style={{color: SKIN.vendor}}><Face r={54} mood={mood} talking={talking} seed={9} /></g>
      </g>
      {f % 40 < 30 && (
        <text x={-200} y={-640} fontFamily={FONT} fontWeight={700} fontSize={44} fill="#fff" stroke="#d23c3c" strokeWidth={10} paintOrder="stroke" textAnchor="middle">ঝালমুড়ি!</text>
      )}
    </g>
  );
};

/** Comic burst with text (horn honks, "boing" etc). Pops in at `at`. */
export const Burst: React.FC<{x: number; y: number; text: string; at: number; color?: string; size?: number; rot?: number; life?: number}> = ({
  x, y, text, at, color = '#ffd35a', size = 64, rot = -8, life = 26,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < at || f > at + life) return null;
  const s = spring({frame: f - at, fps, config: {damping: 8, stiffness: 220}});
  const o = 1 - ramp(f, at + life - 6, at + life);
  const pts = Array.from({length: 24}).map((_, i) => {
    const a = (i / 24) * Math.PI * 2;
    const r = i % 2 ? size * 1.7 : size * 2.4;
    return `${Math.cos(a) * r * 1.25},${Math.sin(a) * r * 0.8}`;
  });
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} opacity={o}>
      <polygon points={pts.join(' ')} fill={color} stroke="#1a1030" strokeWidth={7} strokeLinejoin="round" />
      <text x={0} y={size * 0.35} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={size} fill="#1a1030">{text}</text>
    </g>
  );
};

/** Thought bubble (circles trail from tail → bubble). Children are drawn inside, centred at (0,0). */
export const ThoughtBubble: React.FC<{x: number; y: number; tail: [number, number]; w?: number; h?: number; at: number; until?: number; children: React.ReactNode}> = ({
  x, y, tail, w = 420, h = 300, at, until, children,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < at || (until !== undefined && f > until)) return null;
  const s = spring({frame: f - at, fps, config: {damping: 12, stiffness: 140}});
  const o = until !== undefined ? 1 - ramp(f, until - 8, until) : 1;
  return (
    <g opacity={o}>
      {[0.25, 0.5, 0.75].map((k, i) => (
        <circle key={k} cx={tail[0] + (x - tail[0]) * k * 0.8} cy={tail[1] + (y - tail[1]) * k * 0.8} r={(10 + i * 9) * Math.min(1, s * 2 - k)} fill="#fff" stroke="#1a1030" strokeWidth={5} />
      ))}
      <g transform={`translate(${x},${y}) scale(${s})`}>
        {Array.from({length: 10}).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return <circle key={i} cx={Math.cos(a) * w * 0.42} cy={Math.sin(a) * h * 0.38} r={h * 0.25} fill="#fff" stroke="#1a1030" strokeWidth={5} />;
        })}
        <ellipse rx={w * 0.47} ry={h * 0.42} fill="#fff" />
        {children}
      </g>
    </g>
  );
};

const bn = (n: number) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)]);

/** Clock badge (HTML overlay, top-left safe zone). minutes = minutes since midnight. */
export const ClockBadge: React.FC<{minutes: number; label: string; appearAt?: number; top?: number; danger?: boolean}> = ({minutes, label, appearAt = 0, top = 170, danger = false}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < appearAt) return null;
  const s = spring({frame: f - appearAt, fps, config: {damping: 12, stiffness: 160}});
  const h = Math.floor(minutes / 60) % 24;
  const m = Math.floor(minutes % 60);
  const h12 = ((h + 11) % 12) + 1;
  const ha = ((h % 12) + m / 60) * 30;
  const ma = m * 6;
  const shake = danger ? Math.sin(f * 1.4) * 3 : 0;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{
        position: 'absolute', top, left: 50, display: 'flex', alignItems: 'center', gap: 18, padding: '12px 28px 12px 14px',
        background: danger ? 'rgba(120,10,30,0.88)' : 'rgba(20,12,40,0.82)', borderRadius: 999, border: `4px solid ${danger ? '#ff4d5e' : '#ffd35a'}`,
        transform: `scale(${s}) rotate(${shake}deg)`, transformOrigin: 'left center', fontFamily: FONT, boxShadow: '0 8px 0 rgba(0,0,0,0.3)',
      }}>
        <svg width={96} height={96} viewBox="-50 -50 100 100">
          <circle r={46} fill="#fff8e6" stroke="#1a1030" strokeWidth={6} />
          {Array.from({length: 12}).map((_, i) => (
            <line key={i} x1={0} y1={-38} x2={0} y2={-32} stroke="#1a1030" strokeWidth={4} transform={`rotate(${i * 30})`} />
          ))}
          <line x1={0} y1={0} x2={0} y2={-22} stroke="#1a1030" strokeWidth={7} strokeLinecap="round" transform={`rotate(${ha})`} />
          <line x1={0} y1={0} x2={0} y2={-34} stroke="#d23c3c" strokeWidth={4} strokeLinecap="round" transform={`rotate(${ma})`} />
          <circle r={5} fill="#1a1030" />
        </svg>
        <div style={{display: 'flex', flexDirection: 'column', lineHeight: 1.35}}>
          <span style={{fontSize: 30, fontWeight: 600, color: danger ? '#ffd0d6' : '#ffd35a'}}>{label}</span>
          <span style={{fontSize: 54, fontWeight: 700, color: '#fff'}}>{bn(h12)}:{bn(m).padStart(2, '০')}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Office building with closed gate, padlock and "closed" notice. Origin = ground centre. */
export const OfficeGate: React.FC<{x: number; y: number; scale?: number; night?: number}> = ({x, y, scale = 1, night = 0}) => {
  const f = useCurrentFrame();
  const swing = Math.sin(f / 9) * 4;
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <rect x={-380} y={-1000} width={760} height={1000} fill="#cfd8e3" stroke="#8796a8" strokeWidth={6} />
      {Array.from({length: 4}).map((_, r) =>
        Array.from({length: 5}).map((__, c) => (
          <rect key={`${r}${c}`} x={-330 + c * 135} y={-950 + r * 120} width={95} height={80} rx={6} fill={night > 0.3 && (r + c) % 3 === 0 ? '#ffd96a' : '#5d7088'} />
        )),
      )}
      <rect x={-300} y={-470} width={600} height={90} rx={12} fill="#1f3a63" stroke="#ffd35a" strokeWidth={5} />
      <text x={0} y={-410} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={48} fill="#fff">দ্রুতগতি লিমিটেড</text>
      {/* gate */}
      <rect x={-260} y={-330} width={520} height={330} fill="#4a4f5a" />
      {Array.from({length: 14}).map((_, i) => (
        <rect key={i} x={-250 + i * 37} y={-330} width={12} height={330} fill="#9aa1ad" />
      ))}
      <rect x={-260} y={-200} width={520} height={14} fill="#9aa1ad" />
      {/* chain + lock */}
      <path d="M -40 -230 Q 0 -170 40 -230" stroke="#c9cdd4" strokeWidth={10} fill="none" strokeDasharray="14 6" />
      <g transform={`translate(0,-170) rotate(${swing})`}>
        <path d="M -24 -10 L -24 -40 A 24 24 0 0 1 24 -40 L 24 -10" stroke="#b08a3c" strokeWidth={10} fill="none" />
        <rect x={-38} y={-14} width={76} height={64} rx={10} fill="#e2b33a" stroke="#8a6a10" strokeWidth={5} />
        <circle cx={0} cy={14} r={8} fill="#5a4208" />
      </g>
      {/* notice */}
      <g transform="translate(170,-280) rotate(6)">
        <rect x={-95} y={-50} width={190} height={100} fill="#fffbe8" stroke="#d23c3c" strokeWidth={6} />
        <text x={0} y={-6} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#d23c3c">অফিস ছুটি</text>
        <text x={0} y={34} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={26} fill="#333">কাল আসুন</text>
      </g>
    </g>
  );
};

/** Smartphone video call (screen-space overlay). Boss on the main view, Rumana small; Karim photobombs when `karim` > 0. */
export const VideoCall: React.FC<{x: number; y: number; scale?: number; appear: number; karim?: number; bossTalking?: boolean; rumanaTalking?: boolean}> = ({
  x, y, scale = 1, appear, karim = 0, bossTalking = false, rumanaTalking = false,
}) => {
  const f = useCurrentFrame();
  const W0 = 460;
  const H0 = 860;
  return (
    <g transform={`translate(${x},${y}) scale(${scale * appear}) rotate(${(1 - appear) * -20})`} opacity={Math.min(1, appear * 1.5)}>
      <rect x={-W0 / 2 - 18} y={-H0 / 2 - 18} width={W0 + 36} height={H0 + 36} rx={56} fill="#11141c" />
      <defs>
        <clipPath id="vcScreen"><rect x={-W0 / 2} y={-H0 / 2} width={W0} height={H0} rx={40} /></clipPath>
      </defs>
      <g clipPath="url(#vcScreen)">
        <rect x={-W0 / 2} y={-H0 / 2} width={W0} height={H0} fill="#3c4c6c" />
        <rect x={-W0 / 2} y={-H0 / 2 + 520} width={W0} height={400} fill="#5b4a3a" />
        {/* boss */}
        <g transform="translate(0,-60)">
          <path d="M -170 420 Q -170 200 0 190 Q 170 200 170 420 Z" fill="#26324a" />
          <path d="M -40 200 L 0 300 L 40 200 Z" fill="#f6f3ea" />
          <path d="M -12 205 L 12 205 L 20 300 L 0 330 L -20 300 Z" fill="#d23c3c" />
          <rect x={-24} y={130} width={48} height={60} fill="#c18661" />
          <ellipse cx={0} cy={60} rx={110} ry={120} fill={SKIN.boss} />
          <path d="M -110 30 Q -100 -70 0 -66 Q 100 -70 110 30 Q 90 -20 0 -20 Q -90 -20 -110 30 Z" fill="#3a3a44" />
          <g transform="translate(0,62)" style={{color: SKIN.boss}}><Face r={104} mood="angry" talking={bossTalking} seed={11} /></g>
          <path d="M -50 100 Q 0 80 50 100 Q 0 96 -50 100 Z" fill="#3a3a44" stroke="#3a3a44" strokeWidth={10} />
          <rect x={-80} y={34} width={64} height={40} rx={10} fill="none" stroke="#222" strokeWidth={6} />
          <rect x={16} y={34} width={64} height={40} rx={10} fill="none" stroke="#222" strokeWidth={6} />
          <line x1={-16} y1={50} x2={16} y2={50} stroke="#222" strokeWidth={6} />
        </g>
        {/* Karim photobomb from bottom-left */}
        {karim > 0 && (
          <g transform={`translate(${-W0 / 2 + 70 + karim * 40},${H0 / 2 - 120 - karim * 140}) rotate(${-15 + Math.sin(f / 5) * 6})`}>
            <ellipse rx={70} ry={74} fill={SKIN.karim} />
            <path d="M -72 -26 Q 0 -60 72 -26 L 70 -6 Q 0 -40 -70 -6 Z" fill="#d23c3c" />
            <g style={{color: SKIN.karim}}><Face r={66} mood="happy" talking={false} seed={3} /></g>
            <path d="M -30 24 Q 0 14 30 24 Q 0 22 -30 24 Z" fill="#1f1712" stroke="#1f1712" strokeWidth={8} />
            <g transform="translate(90,-40) rotate(20)">
              <rect x={-16} y={-60} width={32} height={70} rx={14} fill={SKIN.karim} />
              <rect x={-30} y={-90} width={12} height={40} rx={6} fill={SKIN.karim} transform="rotate(-20)" />
              <rect x={14} y={-90} width={12} height={40} rx={6} fill={SKIN.karim} transform="rotate(20)" />
            </g>
          </g>
        )}
        {/* self view */}
        <g transform={`translate(${W0 / 2 - 90},${-H0 / 2 + 130})`}>
          <rect x={-70} y={-95} width={140} height={190} rx={18} fill="#e9d7c6" stroke="#fff" strokeWidth={5} />
          <circle cx={-18} cy={-30} r={28} fill="#1c1420" />
          <ellipse cx={0} cy={0} rx={46} ry={50} fill={SKIN.rumana} />
          <g style={{color: SKIN.rumana}}><Face r={44} mood="hurry" talking={rumanaTalking} seed={4} lashes /></g>
          <path d="M -50 95 Q -50 55 0 52 Q 50 55 50 95 Z" fill="#d6336c" />
        </g>
        {/* call UI */}
        <rect x={-W0 / 2} y={-H0 / 2} width={W0} height={80} fill="rgba(0,0,0,0.35)" />
        <circle cx={-W0 / 2 + 40} cy={-H0 / 2 + 40} r={12} fill={f % 30 < 18 ? '#ff4d5e' : '#7a2030'} />
        <text x={-W0 / 2 + 64} y={-H0 / 2 + 52} fontFamily={FONT} fontWeight={700} fontSize={32} fill="#fff">বস (ভিডিও কল)</text>
        {[[-110, '#ff4d5e'], [0, '#3a3f4a'], [110, '#3a3f4a']].map(([cx, c], i) => (
          <circle key={i} cx={cx as number} cy={H0 / 2 - 70} r={38} fill={c as string} stroke="#fff" strokeWidth={3} />
        ))}
      </g>
    </g>
  );
};

/** A ringing phone icon with vibration lines (screen space). */
export const RingingPhone: React.FC<{x: number; y: number; scale?: number; on: boolean}> = ({x, y, scale = 1, on}) => {
  const f = useCurrentFrame();
  if (!on) return null;
  const buzz = Math.sin(f * 3) * 8;
  return (
    <g transform={`translate(${x + buzz},${y}) scale(${scale}) rotate(${Math.sin(f * 2.2) * 8})`}>
      <rect x={-60} y={-110} width={120} height={220} rx={22} fill="#1d2230" stroke="#fff" strokeWidth={6} />
      <rect x={-46} y={-90} width={92} height={160} rx={10} fill="#3ddc97" />
      <text x={0} y={10} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#0b2a1c">বস</text>
      {[1, 2].map((k) => (
        <g key={k} opacity={(f + k * 5) % 14 < 9 ? 1 : 0.2}>
          <path d={`M ${-80 - k * 22} -50 Q ${-100 - k * 22} 0 ${-80 - k * 22} 50`} stroke="#ffd35a" strokeWidth={8} fill="none" strokeLinecap="round" />
          <path d={`M ${80 + k * 22} -50 Q ${100 + k * 22} 0 ${80 + k * 22} 50`} stroke="#ffd35a" strokeWidth={8} fill="none" strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
};
