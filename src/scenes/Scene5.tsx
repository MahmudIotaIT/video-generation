import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneShell, Vignette} from '../components/SceneShell';
import {Sky, Sun} from '../components/Sky';
import {CloudLayer, Seagulls} from '../components/Weather';
import {Ocean} from '../components/Ocean';
import {Ship} from '../components/Ship';
import {MAP_H, MapView, PTS} from '../components/MapView';
import {Badge} from '../components/Overlays';
import {CLAMP, ramp, windowed} from '../lib/anim';
import {cueStart} from '../data/fx';
import {COLORS, FONT, W} from '../theme';
import type {SceneTiming} from '../timeline';

const MAP_TOP = 330;

const Column: React.FC<{title: string; color: string; items: string[]; start: number; f: number}> = ({title, color, items, start, f}) => (
  <div style={{flex: 1, background: 'rgba(5,15,35,0.88)', borderRadius: 28, padding: '26px 24px', borderTop: `10px solid ${color}`}}>
    <div style={{fontSize: 40, fontWeight: 700, color, marginBottom: 16, lineHeight: 1.4}}>{title}</div>
    {items.map((it, i) => (
      <div key={i} style={{fontSize: 33, color: '#fff', lineHeight: 1.45, marginBottom: 14, opacity: ramp(f, start + i * 8, start + i * 8 + 10),
        transform: `translateY(${(1 - ramp(f, start + i * 8, start + i * 8 + 10)) * 20}px)`}}>
        {it}
      </div>
    ))}
  </div>
);

export const Scene5: React.FC<{t: SceneTiming}> = ({t}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const d = t.duration;
  const s2 = cueStart(t, 2);
  const s3 = cueStart(t, 3);
  const s4 = cueStart(t, 4);
  const shipX = interpolate(f, [0, d], [260, 760], CLAMP);
  const mapOp = windowed(f, s2 - 6, s4 + 6, 14, 12);
  const triFade = 1 - ramp(f, s3, s3 + 40);
  const cardOp = ramp(f, s4 - 4, s4 + 10);
  const card = spring({frame: f - s4, fps, config: {damping: 14}});
  const lx = (PTS.bermuda[0] + PTS.miami[0] + PTS.sanjuan[0]) / 3;
  const ly = (PTS.bermuda[1] + PTS.miami[1] + PTS.sanjuan[1]) / 3;

  return (
    <SceneShell t={t} overlay={
      <>
        <Badge kicker="বাস্তবতা" text="প্রতিদিন বহু জাহাজ ও বিমান এই পথে নিরাপদে চলাচল করে" appearAt={cueStart(t, 0)} top={180} tone="record" size={36} until={s2 - 6} />
        <Badge kicker="NOAA ও মার্কিন কোস্ট গার্ড" text="এখানে নিখোঁজের হার অন্য ব্যস্ত সাগরপথের চেয়ে বেশি — এমন প্রমাণ নেই" appearAt={s3} top={160} tone="record" size={34} opacity={mapOp} />
      </>
    }>
      <Sky stops={['#5db8f5', '#a9dcff 55%', '#e3f5ff 64%']} />
      <Sun x={850} y={330} r={80} />
      <CloudLayer seed="s5" count={5} yMin={250} yMax={800} color="#ffffff" speed={0.8} scale={1.4} opacity={0.9} />
      <Seagulls count={4} />
      <Ocean horizonY={1150} colors={['#4aa3d8', '#3a8fc7', '#2f7db5', '#256aa0', '#1c5788']} roughness={0.7} speed={0.8} split={2}>
        <Ship x={shipX} y={1200} scale={0.9} rock={0.4} />
      </Ocean>
      {mapOp > 0 && (
        <AbsoluteFill style={{opacity: mapOp, background: 'rgba(4,18,40,0.6)'}}>
          <div style={{position: 'absolute', top: MAP_TOP, left: 0, width: W, height: MAP_H}}>
            <MapView pins={[1, 1, 1]} tri={1} triFill={1} triOpacity={triFade} lanes={ramp(f, s2, s2 + 20)} bright={ramp(f, s3, s3 + 40)} labels={1} />
            <div style={{position: 'absolute', left: lx - 200, top: ly - 40, width: 400, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 40,
              color: '#fff', opacity: triFade, textShadow: '0 0 18px rgba(56,232,255,0.9)'}}>
              রহস্যময় ত্রিভুজ?
            </div>
          </div>
        </AbsoluteFill>
      )}
      {cardOp > 0 && (
        <AbsoluteFill style={{opacity: cardOp, background: 'rgba(3,10,25,0.55)'}}>
          <div style={{position: 'absolute', top: 260, left: 50, right: 50, fontFamily: FONT, transform: `scale(${0.9 + 0.1 * Math.min(1, card)})`}}>
            <div style={{display: 'flex', gap: 22}}>
              <Column f={f} start={s4 + 6} title="জনপ্রিয় গল্প" color={COLORS.legend} items={['“চিহ্ন ছাড়াই উধাও”', '“অতিপ্রাকৃত শক্তি”', '“কম্পাস পাগল হয়ে যায়”']} />
              <Column f={f} start={s4 + 12} title="ঐতিহাসিক রেকর্ড" color={COLORS.record} items={['অনেক ঘটনায় ঝড়ের রেকর্ড আছে', 'কিছু ঘটনা ত্রিভুজের বাইরে ঘটেছিল', 'দুর্ঘটনার হার অস্বাভাবিক নয়']} />
            </div>
            <div style={{marginTop: 22, padding: '18px 26px', borderRadius: 20, background: 'rgba(5,15,35,0.85)', color: '#cfe6ff', fontSize: 30, lineHeight: 1.5,
              opacity: ramp(f, s4 + 40, s4 + 52)}}>
              সূত্র: গবেষক ল্যারি কুশে (১৯৭৫) পুরোনো রেকর্ড যাচাই করে দেখান, অনেক গল্পে তথ্য বাদ বা বাড়ানো হয়েছিল। ‘বারমুডা ট্রায়াঙ্গেল’ নামটিই জনপ্রিয় হয় ১৯৬৪ সালের এক ম্যাগাজিন প্রবন্ধে।
            </div>
          </div>
        </AbsoluteFill>
      )}
      <Vignette strength={0.35} />
    </SceneShell>
  );
};
