import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../theme';
import {ramp} from '../lib/anim';

export const TitleText: React.FC<{text: string; appearAt: number; top: number; size?: number; color?: string; glow?: string; until?: number; opacity?: number}> = ({
  text, appearAt, top, size = 90, color = '#fff6d6', glow = 'rgba(56,232,255,0.8)', until, opacity = 1,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < appearAt) return null;
  const s = spring({frame: f - appearAt, fps, config: {damping: 11, stiffness: 120}});
  const out = until !== undefined ? 1 - ramp(f, until, until + 10) : 1;
  const local = f - appearAt;
  const shake = local < 12 ? Math.sin(local * 2.5) * (12 - local) : 0;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{
        position: 'absolute', top, left: 50, right: 50, textAlign: 'center',
        transform: `translateX(${shake}px) scale(${0.6 + 0.4 * s})`, opacity: Math.min(1, s) * out * opacity,
        fontFamily: FONT, fontWeight: 700, fontSize: size, lineHeight: 1.4, color,
        textShadow: `0 0 24px ${glow}, 0 0 60px ${glow}, 0 6px 0 rgba(0,0,0,0.6)`,
      }}>
        {text}
      </div>
    </AbsoluteFill>
  );
};

const TONES = {
  record: {accent: '#3ddc97', bg: 'rgba(8,38,28,0.88)'},
  legend: {accent: '#ff9f43', bg: 'rgba(48,24,6,0.88)'},
  info: {accent: '#5ec8ff', bg: 'rgba(8,20,45,0.88)'},
  warn: {accent: '#ff4d5e', bg: 'rgba(48,8,16,0.88)'},
};

export const Badge: React.FC<{text: string; kicker?: string; appearAt: number; top: number; tone?: keyof typeof TONES; size?: number; until?: number; opacity?: number}> = ({
  text, kicker, appearAt, top, tone = 'info', size = 40, until, opacity = 1,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < appearAt) return null;
  const s = spring({frame: f - appearAt, fps, config: {damping: 15, stiffness: 140}});
  const out = until !== undefined ? 1 - ramp(f, until, until + 8) : 1;
  const c = TONES[tone];
  const o = Math.min(1, s) * out * opacity;
  if (o <= 0.01) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <div style={{
          maxWidth: 920, padding: '16px 30px 18px', borderRadius: 24, background: c.bg, borderLeft: `10px solid ${c.accent}`,
          boxShadow: '0 12px 40px rgba(0,0,0,0.45)', transform: `translateY(${(1 - s) * 40}px)`, opacity: o, fontFamily: FONT,
        }}>
          {kicker && <div style={{color: c.accent, fontSize: 28, fontWeight: 600, marginBottom: 4, lineHeight: 1.4}}>● {kicker}</div>}
          <div style={{color: '#fff', fontSize: size, fontWeight: 600, lineHeight: 1.45}}>{text}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Scanlines: React.FC<{opacity?: number}> = ({opacity = 0.25}) => (
  <AbsoluteFill style={{pointerEvents: 'none', opacity, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.6) 0px, rgba(0,0,0,0.6) 2px, transparent 2px, transparent 6px)'}} />
);
