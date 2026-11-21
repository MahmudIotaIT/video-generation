import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CLAMP} from '../lib/anim';
import type {SceneTiming} from '../timeline';

export const SceneShell: React.FC<{
  t: SceneTiming;
  scale?: number;
  x?: number;
  y?: number;
  fadeIn?: number;
  fadeOut?: number;
  overlay?: React.ReactNode;
  /** screen-fixed vignette strength (does not move with the camera) */
  vignette?: number;
  children: React.ReactNode;
}> = ({t, scale = 1, x = 0, y = 0, fadeIn = 10, fadeOut = 10, overlay, vignette, children}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, Math.max(1, fadeIn), t.duration - fadeOut, t.duration], [fadeIn ? 0 : 1, 1, 1, 0], CLAMP);
  return (
    <AbsoluteFill style={{opacity: o, overflow: 'hidden', background: '#000'}}>
      <AbsoluteFill style={{transform: `translate(${x}px, ${y}px) scale(${scale})`, transformOrigin: '50% 50%'}}>{children}</AbsoluteFill>
      {vignette !== undefined && <Vignette strength={vignette} />}
      {overlay}
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.65}) => (
  <AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,${strength}) 100%)`}} />
);
