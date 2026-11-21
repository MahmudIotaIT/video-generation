import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../theme';
import {CLAMP} from '../lib/anim';
import {SPEAKERS} from '../data/script';
import type {Cue} from '../timeline';

/** Dialogue subtitles: speaker name tag (coloured) + line. Bottom edge stays 440 px above the frame bottom. */
export const Subtitles: React.FC<{cues: Cue[]}> = ({cues}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cue = cues.find((c) => f >= c.start && f < c.end);
  if (!cue) return null;
  const sp = SPEAKERS[cue.who];
  const s = spring({frame: f - cue.start, fps, config: {damping: 14, stiffness: 180}});
  const out = interpolate(f, [cue.end - 4, cue.end], [1, 0], CLAMP);
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 440, pointerEvents: 'none'}}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 940,
        transform: `translateY(${(1 - s) * 24}px) scale(${0.94 + 0.06 * Math.min(1, s)})`, opacity: Math.min(1, s) * out,
      }}>
        <div style={{
          marginBottom: -14, zIndex: 1, padding: '4px 22px 8px', borderRadius: 999, background: sp.color, color: '#1a1030',
          fontFamily: FONT, fontWeight: 700, fontSize: 34, lineHeight: 1.4, boxShadow: '0 4px 0 rgba(0,0,0,0.35)',
        }}>
          {sp.name}
        </div>
        <div style={{
          padding: '18px 34px 22px', background: 'rgba(20,12,40,0.78)', borderRadius: 26,
          border: `4px solid ${sp.color}`, fontFamily: FONT, fontWeight: 700, fontSize: 56, lineHeight: 1.5,
          color: '#ffffff', textAlign: 'center', textShadow: '0 3px 10px rgba(0,0,0,0.85)',
        }}>
          {cue.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};
