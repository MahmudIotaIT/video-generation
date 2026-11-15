import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SceneShell, Vignette} from '../components/SceneShell';
import {Moon, Sky, Stars} from '../components/Sky';
import {CloudLayer, Fog} from '../components/Weather';
import {Ocean} from '../components/Ocean';
import {Avenger, Mariner} from '../components/Planes';
import {Radar} from '../components/Radar';
import {Badge, Scanlines} from '../components/Overlays';
import {CLAMP, ramp} from '../lib/anim';
import {cueStart} from '../data/fx';
import {COLORS, FONT, H, W} from '../theme';
import type {SceneTiming} from '../timeline';

export const Scene3: React.FC<{t: SceneTiming}> = ({t}) => {
  const f = useCurrentFrame();
  const d = t.duration;
  const s3 = cueStart(t, 3);
  const s4 = cueStart(t, 4);
  const s5 = cueStart(t, 5);
  const s6 = cueStart(t, 6);

  const aOp = 1 - ramp(f, s3 - 8, s3 + 6);
  const bOp = Math.min(ramp(f, s3 - 8, s3 + 6), 1 - ramp(f, s4 - 8, s4 + 6));
  const cOp = Math.min(ramp(f, s4 - 8, s4 + 6), 1 - ramp(f, s6 - 10, s6 + 6));
  const dOp = ramp(f, s6 - 10, s6 + 6);

  const groupX = interpolate(f, [0, Math.max(1, s3)], [-120, 1000], CLAMP);
  const formation: [number, number][] = [[0, 0], [-200, -95], [-200, 95], [-400, -185], [-400, 185]];

  const span = Math.max(30, s4 - s3 - 25);
  const blipBase: [number, number][] = [[90, -120], [150, -60], [60, -30], [180, -160], [20, -180]];
  const blips = blipBase.map(([bx, by], i) => ({
    x: bx + (f - s3) * 0.25,
    y: by - (f - s3) * 0.1,
    alpha: 1 - ramp(f, s3 + 12 + (i * span) / 5, s3 + 20 + (i * span) / 5),
  }));
  const warnBlink = Math.floor(f / 8) % 2 === 0 ? 1 : 0.35;

  const marX = interpolate(f, [s4 - 8, s5 + 6], [1250, 420], CLAMP);
  const marAlive = 1 - ramp(f, s5, s5 + 4);
  const boomAge = f - s5;
  const boom = boomAge >= 0 ? Math.exp(-boomAge / 12) : 0;
  const pushD = interpolate(f, [s6, d], [1, 1.08], CLAMP);

  return (
    <SceneShell t={t} scale={dOp > 0.5 ? pushD : 1} overlay={
      <>
        <Badge kicker="ঐতিহাসিক রেকর্ড" text="৫ ডিসেম্বর ১৯৪৫ · ফ্লাইট ১৯" appearAt={cueStart(t, 0)} top={170} tone="record" opacity={aOp} />
        <Badge text="৫টি টিবিএম অ্যাভেঞ্জার টর্পেডো বোমারু · মোট ১৪ জন বিমানকর্মী" appearAt={cueStart(t, 1) + 4} top={340} tone="info" size={34} opacity={aOp} />
        <Badge text="যাত্রা: ফোর্ট লডারডেল নৌ-বিমানঘাঁটি, ফ্লোরিডা" appearAt={cueStart(t, 2)} top={470} tone="info" size={34} opacity={aOp} />
        <Badge kicker="ঐতিহাসিক রেকর্ড" text="খুঁজতে যায় PBM মেরিনার উদ্ধারকারী বিমান · ১৩ জন আরোহী" appearAt={s4} top={170} tone="record" size={36} opacity={cOp} />
        <Badge kicker="রেকর্ড অনুযায়ী" text="এক ট্যাংকার জাহাজ আকাশে আগুনের শিখা দেখার খবর দেয় — সম্ভবত বিস্ফোরণ" appearAt={s5 + 4} top={390} tone="warn" size={34} opacity={cOp} />
        <Badge kicker="তথ্য" text="বিমানগুলোর ধ্বংসাবশেষ আজও নিশ্চিতভাবে শনাক্ত হয়নি" appearAt={s6} top={200} tone="info" size={38} opacity={dOp} />
      </>
    }>
      {aOp > 0 && (
        <AbsoluteFill style={{opacity: aOp}}>
          <Sky stops={['#111a3a', '#3a3d6b 50%', '#b9675a 64%', '#e3916a 66%']} />
          <CloudLayer seed="s3a" count={6} yMin={300} yMax={1000} color="#2a2f57" speed={3.2} scale={1.8} opacity={0.9} />
          <AbsoluteFill>
            <svg width={W} height={H}>
              {formation.map(([dx, dy], i) => (
                <Avenger key={i} x={groupX + dx} y={860 + dy + Math.sin(f / 14 + i) * 6} scale={0.85} rot={Math.sin(f / 30 + i) * 2} />
              ))}
            </svg>
          </AbsoluteFill>
          <CloudLayer seed="s3b" count={3} yMin={950} yMax={1120} color="#4a4677" speed={6} scale={2.4} opacity={0.85} />
          <Ocean horizonY={1260} colors={['#3b4a75', '#2d3c66', '#223156', '#1a2747', '#121d38']} roughness={1.1} />
          <Vignette />
        </AbsoluteFill>
      )}
      {bOp > 0 && (
        <AbsoluteFill style={{opacity: bOp, background: 'radial-gradient(circle at 50% 45%, #06251a 0%, #010805 72%)'}}>
          <svg width={W} height={H}>
            <Radar cx={540} cy={860} r={380} blips={blips} />
          </svg>
          <div style={{position: 'absolute', top: 1290, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontWeight: 700,
            fontSize: 56, color: COLORS.danger, opacity: warnBlink, textShadow: '0 0 24px rgba(255,77,94,0.8)'}}>
            সংকেত হারিয়ে যাচ্ছে…
          </div>
          <Scanlines opacity={0.22} />
        </AbsoluteFill>
      )}
      {cOp > 0 && (
        <AbsoluteFill style={{opacity: cOp}}>
          <Sky stops={['#030712', '#0b1430 55%', '#18244a 66%']} />
          <Stars count={70} maxY={1100} opacity={0.6} seed="s3n" />
          <Moon x={220} y={560} r={50} />
          <CloudLayer seed="s3c" count={5} yMin={500} yMax={1050} color="#141c38" speed={1.5} scale={1.8} />
          <AbsoluteFill>
            <svg width={W} height={H}>
              <defs>
                <radialGradient id="boom">
                  <stop offset="0%" stopColor="rgba(255,220,140,1)" />
                  <stop offset="45%" stopColor="rgba(255,120,40,0.8)" />
                  <stop offset="100%" stopColor="rgba(255,80,20,0)" />
                </radialGradient>
              </defs>
              <Mariner x={marX} y={820 + Math.sin(f / 15) * 8} scale={0.9} flip opacity={marAlive} />
              {boom > 0.01 && <circle cx={marX} cy={820} r={40 + boomAge * 4} fill="url(#boom)" opacity={boom} />}
            </svg>
          </AbsoluteFill>
          <Ocean horizonY={1240} colors={['#141f3d', '#101a35', '#0c152c', '#091023', '#060b19']} roughness={1.2} />
          <Fog opacity={0.35} top={1050} rgb="120,140,180" />
          <Vignette />
        </AbsoluteFill>
      )}
      {dOp > 0 && (
        <AbsoluteFill style={{opacity: dOp}}>
          <Sky stops={['#02040b', '#0a1128 60%', '#121c3d 66%']} />
          <Stars count={80} maxY={1150} opacity={0.55} seed="s3d" />
          <div style={{position: 'absolute', top: 470, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontWeight: 700,
            fontSize: 380, color: 'rgba(120,180,255,0.12)', transform: `scale(${1 + (f - s6) * 0.002})`}}>?</div>
          <Ocean horizonY={1240} colors={['#101a33', '#0d162d', '#0a1226', '#070e1e', '#050a16']} roughness={0.8} />
          <Fog opacity={0.5} top={1000} rgb="110,130,170" />
          <Vignette strength={0.75} />
        </AbsoluteFill>
      )}
    </SceneShell>
  );
};
