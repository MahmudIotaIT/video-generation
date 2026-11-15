import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../theme';
import {CLAMP} from '../lib/anim';
import type {Cue} from '../timeline';

export const Subtitles: React.FC<{cues: Cue[]}> = ({cues}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cue = cues.find((c) => f >= c.start && f < c.end);
  if (!cue) return null;
  const s = spring({frame: f - cue.start, fps, config: {damping: 14, stiffness: 180}});
  const out = interpolate(f, [cue.end - 4, cue.end], [1, 0], CLAMP);
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 440, pointerEvents: 'none'}}>
      <div style={{
        maxWidth: 900, padding: '16px 34px 22px', background: 'rgba(5,10,25,0.66)', borderRadius: 26,
        border: '2px solid rgba(255,255,255,0.14)', fontFamily: FONT, fontWeight: 700, fontSize: 58, lineHeight: 1.5,
        color: '#ffffff', textAlign: 'center', textShadow: '0 3px 10px rgba(0,0,0,0.85)',
        transform: `translateY(${(1 - s) * 24}px) scale(${0.94 + 0.06 * Math.min(1, s)})`, opacity: Math.min(1, s) * out,
      }}>
        {cue.text}
      </div>
    </AbsoluteFill>
  );
};
