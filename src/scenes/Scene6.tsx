import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneShell, Vignette} from '../components/SceneShell';
import {Moon, Sky, Stars} from '../components/Sky';
import {CloudLayer, Flash, Fog, Lightning} from '../components/Weather';
import {Ocean} from '../components/Ocean';
import {Ship} from '../components/Ship';
import {TitleText} from '../components/Overlays';
import {CLAMP, ramp} from '../lib/anim';
import {cueStart, strikesFor} from '../data/fx';
import {COLORS, FONT, W} from '../theme';
import type {SceneTiming} from '../timeline';

const HORIZON = 1180;

export const Scene6: React.FC<{t: SceneTiming}> = ({t}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const d = t.duration;
  const s2 = cueStart(t, 2);
  const s3 = cueStart(t, 3);
  const strikes = strikesFor(t);

  const travel = ramp(f, 0, s2 + 10);
  const shipX = interpolate(travel, [0, 1], [330, 640]);
  const shipScale = interpolate(travel, [0, 1], [0.85, 0.28]);
  const shipY = interpolate(travel, [0, 1], [1255, HORIZON + 4]) + ramp(f, s2, s2 + 40, 0, 40);
  const clipY = interpolate(f, [0, Math.max(1, s2 - 10), Math.max(2, s2)], [2000, 2000, HORIZON + 6], CLAMP);
  const camScale = interpolate(f, [0, d], [1.25, 1.0], CLAMP);
  const qOp = ramp(f, s2, s2 + 20);
  const cta = spring({frame: f - s3, fps, config: {damping: 9, stiffness: 120}});
  const bounce = Math.sin(f / 6) * 6;

  return (
    <SceneShell t={t} scale={camScale} fadeOut={24} overlay={
      <>
        <Flash strikes={strikes} max={0.2} />
        <TitleText text="?" appearAt={s2} top={330} size={300} color="#dbe9ff" glow="rgba(120,180,255,0.7)" opacity={qOp * (f < s3 ? 1 : 0.35)} />
        {f >= s3 && (
          <AbsoluteFill style={{pointerEvents: 'none'}}>
            <div style={{position: 'absolute', top: 250, left: 50, right: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22,
              transform: `scale(${0.6 + 0.4 * Math.min(1.1, cta)})`, opacity: Math.min(1, cta), fontFamily: FONT}}>
              <svg width={130} height={120} viewBox="0 0 130 120" style={{transform: `translateY(${bounce}px)`}}>
                <path d="M 15 10 H 115 a 12 12 0 0 1 12 12 V 72 a 12 12 0 0 1 -12 12 H 55 L 25 110 V 84 H 15 a 12 12 0 0 1 -12 -12 V 22 a 12 12 0 0 1 12 -12 Z" fill={COLORS.gold} />
                <circle cx={40} cy={47} r={8} fill="#1b2440" />
                <circle cx={65} cy={47} r={8} fill="#1b2440" />
                <circle cx={90} cy={47} r={8} fill="#1b2440" />
              </svg>
              <div style={{fontSize: 76, fontWeight: 700, color: '#fff', textAlign: 'center', lineHeight: 1.35, textShadow: '0 0 30px rgba(255,207,90,0.7), 0 6px 0 rgba(0,0,0,0.6)'}}>
                আপনার মতামত কমেন্টে জানান!
              </div>
              <div style={{display: 'flex', gap: 18, marginTop: 6}}>
                {['ক) রহস্য এখনো আছে', 'খ) বিজ্ঞানেই সমাধান'].map((o, i) => (
                  <div key={o} style={{padding: '14px 26px', borderRadius: 999, fontSize: 36, fontWeight: 700, color: '#fff',
                    background: i ? 'rgba(61,220,151,0.25)' : 'rgba(255,159,67,0.25)', border: `3px solid ${i ? COLORS.record : COLORS.legend}`,
                    opacity: ramp(f, s3 + 12 + i * 6, s3 + 22 + i * 6)}}>
                    {o}
                  </div>
                ))}
              </div>
            </div>
          </AbsoluteFill>
        )}
      </>
    }>
      <Sky stops={['#05070f', '#141a3a 48%', '#3a2a55 58%', '#7a4a5a 62%']} />
      <Stars count={90} maxY={1100} opacity={0.7} seed="s6" />
      <Moon x={300} y={520} r={64} />
      <Lightning strikes={strikes} y0={200} y1={900} />
      <CloudLayer seed="s6c" count={5} yMin={600} yMax={1050} color="#1f1d3d" speed={0.7} scale={2} opacity={0.85} />
      <Ocean horizonY={HORIZON} colors={['#1f2347', '#191d3d', '#141832', '#0f1228', '#0a0d1d']} roughness={0.9} split={1}>
        <defs>
          <clipPath id="s6clip"><rect x={0} y={0} width={W} height={clipY} /></clipPath>
        </defs>
        <g clipPath="url(#s6clip)">
          <Ship x={shipX} y={shipY} scale={shipScale} rock={0.6} lights />
        </g>
      </Ocean>
      <Fog opacity={0.4} top={980} rgb="140,130,190" />
      <Vignette strength={0.75} />
    </SceneShell>
  );
};
