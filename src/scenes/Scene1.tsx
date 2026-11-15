import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {SceneShell, Vignette} from '../components/SceneShell';
import {Moon, Sky, Stars} from '../components/Sky';
import {CloudLayer, Flash, Fog, Lightning, Rain} from '../components/Weather';
import {Ocean} from '../components/Ocean';
import {Ship} from '../components/Ship';
import {Badge, TitleText} from '../components/Overlays';
import {CLAMP} from '../lib/anim';
import {strikesFor} from '../data/fx';
import type {SceneTiming} from '../timeline';

export const Scene1: React.FC<{t: SceneTiming}> = ({t}) => {
  const f = useCurrentFrame();
  const d = t.duration;
  const strikes = strikesFor(t);
  const shipX = interpolate(f, [0, d], [170, 700]);
  const fog = interpolate(f, [d * 0.2, d * 0.62], [0.1, 1], CLAMP);
  const shipFade = interpolate(f, [d * 0.4, d * 0.7], [1, 0], CLAMP);
  const scale = interpolate(f, [0, d], [1.18, 1.02]);
  const titleAt = Math.round(d * 0.58);

  return (
    <SceneShell t={t} scale={scale} fadeIn={0} overlay={
      <>
        <Badge kicker="কল্পনা করুন" text="ঝড়ের রাত, মাঝ সমুদ্র…" appearAt={6} top={200} tone="legend" size={36} until={titleAt - 10} />
        <TitleText text="বারমুডা ট্রায়াঙ্গেলের রহস্য!" appearAt={titleAt} top={230} size={94} />
        <Flash strikes={strikes} max={0.55} />
      </>
    }>
      <Sky stops={['#03060f', '#0b1530 45%', '#1d2c52 53%']} />
      <Stars count={50} maxY={650} opacity={0.5} />
      <Moon x={820} y={330} r={58} />
      <Lightning strikes={strikes} y0={140} y1={1000} />
      <CloudLayer seed="s1a" count={6} yMin={120} yMax={520} color="#141d36" speed={0.6} scale={2.2} />
      <CloudLayer seed="s1b" count={5} yMin={320} yMax={720} color="#1c2747" speed={1.1} scale={1.6} />
      <Ocean horizonY={1020} colors={['#0f2340', '#0c1f3a', '#0a1a31', '#081528', '#06101f']} roughness={1.5} split={2}>
        <Ship x={shipX} y={1060} scale={0.95} opacity={shipFade} lights />
      </Ocean>
      <Fog opacity={fog} top={760} />
      <Rain count={130} opacity={0.45} />
      <Vignette />
    </SceneShell>
  );
};
