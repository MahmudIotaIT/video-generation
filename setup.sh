#!/usr/bin/env bash
# Bermuda Triangle Short – one-shot project setup
set -euo pipefail
cd "$(dirname "$0")"
echo "📁 Creating project in: $(pwd)"
mkdir -p src/data src/lib src/components src/scenes scripts public/audio/sfx public/audio/narration narration/tts out

cat > package.json <<'EOF_FILE'
{
  "name": "bermuda-triangle-short",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "remotion studio src/index.ts",
    "sfx": "bash scripts/generate-sfx.sh",
    "export-text": "tsx scripts/export-narration.ts",
    "voice": "bash scripts/generate-voice.sh",
    "srt": "tsx scripts/make-srt.ts",
    "audio": "npm run sfx && npm run voice",
    "still": "remotion still src/index.ts BermudaTriangle out/preview.png --frame=330",
    "render": "bash scripts/render.sh",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@remotion/cli": "^4.0.0",
    "@remotion/google-fonts": "^4.0.0",
    "@remotion/media-utils": "^4.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "remotion": "^4.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.3.3",
    "tsx": "^4.7.0",
    "typescript": "^5.4.0"
  }
}
EOF_FILE

cat > tsconfig.json <<'EOF_FILE'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "lib": ["DOM", "ES2020"],
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src", "scripts"]
}
EOF_FILE

cat > remotion.config.ts <<'EOF_FILE'
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setPixelFormat('yuv420p');
Config.setCodec('h264');
Config.setCrf(18);
EOF_FILE

cat > src/index.ts <<'EOF_FILE'
import {registerRoot} from 'remotion';
import {RemotionRoot} from './Root';

registerRoot(RemotionRoot);
EOF_FILE

cat > src/data/script.ts <<'EOF_FILE'
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const LEAD_IN = 0.5;
export const TAIL = 1.0;

export type SceneScript = {id: string; minSeconds: number; chunks: string[]; tts: string};

export const SCENES: SceneScript[] = [
  {
    id: '1-Hook',
    minSeconds: 8,
    chunks: ['ভাবুন তো!', 'বিশাল সমুদ্রের মাঝখানে', 'হঠাৎ উধাও হয়ে গেল একটি জাহাজ!', 'কোনো সংকেত নেই, কোনো খোঁজ নেই!', 'এমন ঘটনা কি সত্যিই ঘটে?'],
    tts: 'ভাবুন তো! বিশাল সমুদ্রের মাঝখানে, হঠাৎ উধাও হয়ে গেল একটি জাহাজ! কোনো সংকেত নেই... কোনো খোঁজ নেই! এমন ঘটনা কি সত্যিই ঘটে?',
  },
  {
    id: '2-Location',
    minSeconds: 10,
    chunks: ['আটলান্টিক মহাসাগরের একটি অঞ্চল,', 'যা বারমুডা ট্রায়াঙ্গেল নামে পরিচিত।', 'বারমুডা, ফ্লোরিডা আর পুয়ের্তো রিকো—', 'এই তিন জায়গাকে যুক্ত করলেই', 'তৈরি হয় রহস্যময় ত্রিভুজ!'],
    tts: 'আটলান্টিক মহাসাগরের একটি অঞ্চল, যা বারমুডা ট্রায়াঙ্গেল নামে পরিচিত। বারমুডা, ফ্লোরিডা, আর পুয়ের্তো রিকো... এই তিন জায়গাকে যুক্ত করলেই তৈরি হয় রহস্যময় ত্রিভুজ!',
  },
  {
    id: '3-Flight19',
    minSeconds: 17,
    chunks: ['১৯৪৫ সালের ৫ ডিসেম্বর,', '‘ফ্লাইট ১৯’ নামে মার্কিন নৌবাহিনীর', 'পাঁচটি সামরিক বিমান প্রশিক্ষণে বের হয়েছিল।', 'কিন্তু তারা আর ফিরে আসেনি।', 'তাদের খুঁজতে যাওয়া একটি উদ্ধারকারী বিমানও', 'নিখোঁজ হয়।', 'ঘটনাটি রহস্যকে আরও বাড়িয়ে দেয়।'],
    tts: 'উনিশশো পঁয়তাল্লিশ সালের পাঁচই ডিসেম্বর, ফ্লাইট উনিশ নামে মার্কিন নৌবাহিনীর পাঁচটি সামরিক বিমান প্রশিক্ষণে বের হয়েছিল। কিন্তু... তারা আর ফিরে আসেনি। তাদের খুঁজতে যাওয়া একটি উদ্ধারকারী বিমানও নিখোঁজ হয়। ঘটনাটি রহস্যকে আরও বাড়িয়ে দেয়।',
  },
  {
    id: '4-Science',
    minSeconds: 20,
    chunks: ['তবে বিজ্ঞানীরা বলছেন,', 'এর পেছনে অতিপ্রাকৃত কিছু থাকার প্রমাণ নেই।', 'শক্তিশালী ঝড়,', 'বিশাল ঢেউ,', 'সমুদ্রের স্রোত,', 'নেভিগেশনের ভুল', 'এবং মানুষের ভুল সিদ্ধান্ত—', 'এসবই দুর্ঘটনার কারণ হতে পারে।'],
    tts: 'তবে বিজ্ঞানীরা বলছেন, এর পেছনে অতিপ্রাকৃত কিছু থাকার প্রমাণ নেই। শক্তিশালী ঝড়, বিশাল ঢেউ, সমুদ্রের স্রোত, নেভিগেশনের ভুল, এবং মানুষের ভুল সিদ্ধান্ত... এসবই দুর্ঘটনার কারণ হতে পারে।',
  },
  {
    id: '5-Truth',
    minSeconds: 17,
    chunks: ['গবেষণায় বারমুডা ট্রায়াঙ্গেলকে', 'অন্য ব্যস্ত সমুদ্রপথের তুলনায়', 'অস্বাভাবিক বিপজ্জনক প্রমাণ করার', 'নির্ভরযোগ্য ভিত্তি পাওয়া যায়নি।', 'অনেক গল্পই অতিরঞ্জিত', 'বা অসম্পূর্ণ তথ্যের ওপর তৈরি।'],
    tts: 'গবেষণায় বারমুডা ট্রায়াঙ্গেলকে, অন্য ব্যস্ত সমুদ্রপথের তুলনায় অস্বাভাবিক বিপজ্জনক প্রমাণ করার নির্ভরযোগ্য ভিত্তি পাওয়া যায়নি। অনেক গল্পই অতিরঞ্জিত, বা অসম্পূর্ণ তথ্যের ওপর তৈরি।',
  },
  {
    id: '6-Ending',
    minSeconds: 13,
    chunks: ['তাহলে কি বারমুডা ট্রায়াঙ্গেলের', 'রহস্যের সমাধান হয়ে গেছে?', 'নাকি এখনো কিছু প্রশ্নের উত্তর অজানা?', 'আপনার কী মনে হয়?'],
    tts: 'তাহলে কি বারমুডা ট্রায়াঙ্গেলের রহস্যের সমাধান হয়ে গেছে? নাকি... এখনো কিছু প্রশ্নের উত্তর অজানা? আপনার কী মনে হয়?',
  },
];

export const narrationFile = (i: number) => `audio/narration/scene${i + 1}.mp3`;

export const SFX = {
  music: 'audio/music.mp3',
  ocean: 'audio/sfx/ocean.mp3',
  wind: 'audio/sfx/wind.mp3',
  thunder: 'audio/sfx/thunder.mp3',
  radar: 'audio/sfx/radar.mp3',
  whoosh: 'audio/sfx/whoosh.mp3',
  riser: 'audio/sfx/riser.mp3',
} as const;

export const ALL_ASSETS: string[] = [...Object.values(SFX), ...SCENES.map((_, i) => narrationFile(i))];
EOF_FILE

cat > src/timeline.ts <<'EOF_FILE'
import {FPS, LEAD_IN, SCENES, TAIL} from './data/script';

export type Cue = {text: string; start: number; end: number};
export type SceneTiming = {
  index: number;
  from: number;
  duration: number;
  narrationStart: number;
  narrationFrames: number;
  hasAudio: boolean;
  cues: Cue[];
};
export type Timeline = {fps: number; total: number; scenes: SceneTiming[]; cues: Cue[]};

const weight = (s: string) => {
  const tr = s.trim();
  let w = tr.replace(/\s+/g, ' ').length;
  const last = tr.slice(-1);
  if ('।!?'.includes(last)) w += 6;
  else if (',—–-'.includes(last)) w += 3;
  return w;
};

export function buildTimeline(audioSeconds: (number | null | undefined)[], fps = FPS): Timeline {
  let cursor = 0;
  const scenes: SceneTiming[] = [];
  const all: Cue[] = [];
  SCENES.forEach((sc, i) => {
    const a = audioSeconds[i];
    const hasAudio = typeof a === 'number' && a > 0;
    const narrSec = hasAudio ? (a as number) : sc.minSeconds - LEAD_IN - TAIL - 0.3;
    const durSec = Math.max(sc.minSeconds, LEAD_IN + narrSec + TAIL);
    const duration = Math.round(durSec * fps);
    const narrationStart = Math.round(LEAD_IN * fps);
    const narrationFrames = Math.round(narrSec * fps);
    const weights = sc.chunks.map(weight);
    const totalW = weights.reduce((x, y) => x + y, 0);
    let acc = 0;
    const cues: Cue[] = sc.chunks.map((text, k) => {
      const start = narrationStart + Math.round((acc / totalW) * narrationFrames);
      acc += weights[k];
      const end =
        k === sc.chunks.length - 1
          ? Math.min(duration - 2, narrationStart + narrationFrames + 9)
          : narrationStart + Math.round((acc / totalW) * narrationFrames);
      return {text, start, end};
    });
    scenes.push({index: i, from: cursor, duration, narrationStart, narrationFrames, hasAudio, cues});
    cues.forEach((c) => all.push({text: c.text, start: c.start + cursor, end: c.end + cursor}));
    cursor += duration;
  });
  return {fps, total: cursor, scenes, cues: all};
}
EOF_FILE

cat > src/data/fx.ts <<'EOF_FILE'
import type {SceneTiming} from '../timeline';

export const cueStart = (t: SceneTiming, i: number) => t.cues[Math.min(Math.max(i, 0), t.cues.length - 1)]?.start ?? 0;
export const cueEnd = (t: SceneTiming, i: number) => t.cues[Math.min(Math.max(i, 0), t.cues.length - 1)]?.end ?? t.duration;

export const strikesFor = (t: SceneTiming): number[] => {
  const d = t.duration;
  switch (t.index) {
    case 0:
      return [0.12, 0.45, 0.8].map((x) => Math.round(d * x));
    case 3: {
      const s = cueStart(t, 2);
      const w = cueStart(t, 3);
      return [s + 4, s + 26, w + 12, w + 30];
    }
    case 5:
      return [Math.round(d * 0.28)];
    default:
      return [];
  }
};

export const radarPings = (t: SceneTiming): number[] => {
  if (t.index !== 2) return [];
  const out: number[] = [];
  for (let f = cueStart(t, 3); f < cueStart(t, 4); f += 30) out.push(f);
  return out;
};
EOF_FILE

cat > src/theme.ts <<'EOF_FILE'
import {loadFont} from '@remotion/google-fonts/HindSiliguri';

export const {fontFamily: FONT} = loadFont('normal', {
  weights: ['400', '500', '600', '700'],
  subsets: ['bengali', 'latin'],
});

export const W = 1080;
export const H = 1920;

export const COLORS = {
  glow: '#38e8ff',
  gold: '#ffcf5a',
  danger: '#ff4d5e',
  record: '#3ddc97',
  legend: '#ff9f43',
  info: '#5ec8ff',
  land: '#d9c79a',
  landEdge: '#f3e6c0',
};
EOF_FILE

cat > src/lib/anim.ts <<'EOF_FILE'
import {Easing, interpolate} from 'remotion';

export const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = Easing.inOut(Easing.cubic);

export const ramp = (f: number, a: number, b: number, from = 0, to = 1, easing: (n: number) => number = ease): number => {
  if (b <= a) return f >= a ? to : from;
  return interpolate(f, [a, b], [from, to], {...CLAMP, easing});
};

export const windowed = (f: number, start: number, end: number, fin = 10, fout = 10) =>
  Math.max(0, Math.min(ramp(f, start, start + fin), 1 - ramp(f, end - fout, end)));

export const mono = (arr: number[]) => {
  const out = [...arr];
  for (let i = 1; i < out.length; i++) if (out[i] <= out[i - 1]) out[i] = out[i - 1] + 1;
  return out;
};

export function wavePath(o: {width: number; baseY: number; amp: number; length: number; phase: number; bottom: number; step?: number}) {
  const step = o.step ?? 24;
  let d = `M ${-step} ${o.bottom}`;
  for (let x = -step; x <= o.width + step; x += step) {
    const y =
      o.baseY +
      Math.sin((x / o.length) * Math.PI * 2 + o.phase) * o.amp +
      Math.sin((x / (o.length * 0.47)) * Math.PI * 2 - o.phase * 1.3) * o.amp * 0.35;
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  d += ` L ${o.width + step} ${o.bottom} Z`;
  return d;
}

export const flashIntensity = (f: number, strikes: number[]) => {
  let v = 0;
  for (const s of strikes) {
    const dt = f - s;
    if (dt < 0 || dt > 24) continue;
    const flick = dt < 2 ? 1 : dt < 4 ? 0.35 : dt < 6 ? 0.85 : 1;
    v = Math.max(v, Math.exp(-dt / 5) * flick);
  }
  return v;
};

export function pointOnPolyline(pts: [number, number][], t: number): [number, number] {
  const seg: number[] = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    seg.push(l);
    total += l;
  }
  let target = Math.max(0, Math.min(1, t)) * total;
  for (let i = 0; i < seg.length; i++) {
    if (target <= seg[i]) {
      const k = seg[i] === 0 ? 0 : target / seg[i];
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
    }
    target -= seg[i];
  }
  return pts[pts.length - 1];
}
EOF_FILE

cat > src/Root.tsx <<'EOF_FILE'
import React from 'react';
import {CalculateMetadataFunction, Composition, staticFile} from 'remotion';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {BermudaVideo, VideoProps} from './Video';
import {ALL_ASSETS, FPS, HEIGHT, SCENES, WIDTH, narrationFile} from './data/script';
import {buildTimeline} from './timeline';

const assetExists = async (p: string) => {
  try {
    const r = await fetch(staticFile(p));
    return r.ok;
  } catch {
    return false;
  }
};

const calculateMetadata: CalculateMetadataFunction<VideoProps> = async () => {
  const entries = await Promise.all(ALL_ASSETS.map(async (p) => [p, await assetExists(p)] as const));
  const assets = Object.fromEntries(entries) as Record<string, boolean>;
  const durations = await Promise.all(
    SCENES.map(async (_, i) => {
      const p = narrationFile(i);
      if (!assets[p]) return null;
      try {
        return await getAudioDurationInSeconds(staticFile(p));
      } catch {
        return null;
      }
    }),
  );
  const timeline = buildTimeline(durations);
  return {durationInFrames: timeline.total, props: {timeline, assets}};
};

const fallback = buildTimeline([]);

export const RemotionRoot: React.FC = () => (
  <Composition
    id="BermudaTriangle"
    component={BermudaVideo}
    durationInFrames={fallback.total}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={{timeline: fallback, assets: {}}}
    calculateMetadata={calculateMetadata}
  />
);
EOF_FILE

cat > src/Video.tsx <<'EOF_FILE'
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {FONT} from './theme';
import {SCENES} from './data/script';
import type {SceneTiming, Timeline} from './timeline';
import {Subtitles} from './components/Subtitles';
import {SoundDesign} from './components/SoundDesign';
import {Scene1} from './scenes/Scene1';
import {Scene2} from './scenes/Scene2';
import {Scene3} from './scenes/Scene3';
import {Scene4} from './scenes/Scene4';
import {Scene5} from './scenes/Scene5';
import {Scene6} from './scenes/Scene6';

export type VideoProps = {timeline: Timeline; assets: Record<string, boolean>};

const SCENE_COMPONENTS: React.FC<{t: SceneTiming}>[] = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6];

export const BermudaVideo: React.FC<VideoProps> = ({timeline, assets}) => (
  <AbsoluteFill style={{backgroundColor: '#000', fontFamily: FONT}}>
    {timeline.scenes.map((s, i) => {
      const C = SCENE_COMPONENTS[i];
      return (
        <Sequence key={i} from={s.from} durationInFrames={s.duration} name={SCENES[i].id}>
          <C t={s} />
        </Sequence>
      );
    })}
    <Subtitles cues={timeline.cues} />
    <SoundDesign timeline={timeline} assets={assets} />
  </AbsoluteFill>
);
EOF_FILE

cat > src/components/SceneShell.tsx <<'EOF_FILE'
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
  children: React.ReactNode;
}> = ({t, scale = 1, x = 0, y = 0, fadeIn = 10, fadeOut = 10, overlay, children}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, Math.max(1, fadeIn), t.duration - fadeOut, t.duration], [fadeIn ? 0 : 1, 1, 1, 0], CLAMP);
  return (
    <AbsoluteFill style={{opacity: o, overflow: 'hidden', background: '#000'}}>
      <AbsoluteFill style={{transform: `translate(${x}px, ${y}px) scale(${scale})`, transformOrigin: '50% 50%'}}>{children}</AbsoluteFill>
      {overlay}
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.65}) => (
  <AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,${strength}) 100%)`}} />
);
EOF_FILE

cat > src/components/Sky.tsx <<'EOF_FILE'
import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {H, W} from '../theme';

export const Sky: React.FC<{stops: string[]}> = ({stops}) => (
  <AbsoluteFill style={{background: `linear-gradient(180deg, ${stops.join(', ')})`}} />
);

export const Stars: React.FC<{count?: number; maxY?: number; opacity?: number; seed?: string}> = ({count = 60, maxY = 800, opacity = 0.7, seed = 'st'}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        {Array.from({length: count}).map((_, i) => {
          const x = random(`${seed}x${i}`) * W;
          const y = random(`${seed}y${i}`) * maxY;
          const r = 1 + random(`${seed}r${i}`) * 2.2;
          const tw = 0.5 + 0.5 * Math.sin(f * 0.12 + i * 1.7);
          return <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={opacity * (0.35 + 0.65 * tw)} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

export const Moon: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 70}) => (
  <AbsoluteFill>
    <svg width={W} height={H}>
      <defs>
        <radialGradient id="moonGlow">
          <stop offset="0%" stopColor="rgba(255,244,214,0.55)" />
          <stop offset="100%" stopColor="rgba(255,244,214,0)" />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r * 3.2} fill="url(#moonGlow)" />
      <circle cx={x} cy={y} r={r} fill="#fff4d6" />
      <circle cx={x - r * 0.3} cy={y - r * 0.2} r={r * 0.16} fill="#eadfbe" />
      <circle cx={x + r * 0.35} cy={y + r * 0.25} r={r * 0.12} fill="#eadfbe" />
      <circle cx={x + r * 0.1} cy={y - r * 0.45} r={r * 0.08} fill="#eadfbe" />
    </svg>
  </AbsoluteFill>
);

export const Sun: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 90}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <g transform={`translate(${x},${y}) rotate(${f * 0.3})`}>
          {Array.from({length: 12}).map((_, i) => (
            <rect key={i} x={-6} y={-r * 1.9} width={12} height={r * 0.55} rx={6} fill="#fff3b0" opacity={0.7} transform={`rotate(${i * 30})`} />
          ))}
        </g>
        <circle cx={x} cy={y} r={r * 1.35} fill="rgba(255,240,170,0.35)" />
        <circle cx={x} cy={y} r={r} fill="#ffe27a" />
      </svg>
    </AbsoluteFill>
  );
};
EOF_FILE

cat > src/components/Ocean.tsx <<'EOF_FILE'
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {H, W} from '../theme';
import {wavePath} from '../lib/anim';

type OceanProps = {
  horizonY: number;
  colors: string[];
  roughness?: number;
  speed?: number;
  split?: number;
  foam?: boolean;
  children?: React.ReactNode;
};

export const Ocean: React.FC<OceanProps> = ({horizonY, colors, roughness = 1, speed = 1, split = 1, foam = true, children}) => {
  const f = useCurrentFrame();
  const n = colors.length;
  const layers = colors.map((color, i) => {
    const t = n === 1 ? 0 : i / (n - 1);
    const baseY = horizonY + Math.pow(t, 1.6) * (H - horizonY) * 0.8;
    return {
      color,
      t,
      d: wavePath({width: W, baseY, amp: (4 + t * 46) * roughness, length: 180 + t * 520, phase: f * 0.05 * speed * (0.6 + t) + i * 1.9, bottom: H + 40}),
    };
  });
  const draw = (l: (typeof layers)[number], i: number) => (
    <g key={i}>
      <path d={l.d} fill={l.color} />
      {foam && l.t > 0.2 && <path d={l.d} fill="none" stroke="rgba(220,240,255,0.16)" strokeWidth={3 + l.t * 4} />}
    </g>
  );
  return (
    <AbsoluteFill>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {layers.slice(0, split).map(draw)}
        {children}
        {layers.slice(split).map((l, i) => draw(l, i + split))}
      </svg>
    </AbsoluteFill>
  );
};
EOF_FILE

cat > src/components/Ship.tsx <<'EOF_FILE'
import React from 'react';
import {useCurrentFrame} from 'remotion';

export const Ship: React.FC<{x: number; y: number; scale?: number; rock?: number; opacity?: number; lights?: boolean; smoke?: boolean}> = ({
  x, y, scale = 1, rock = 1, opacity = 1, lights = false, smoke = true,
}) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 13) * 5 * rock;
  const rot = Math.sin(f / 19) * 2.5 * rock;
  const containers = ['#e8743b', '#2bb3a3', '#f2c14e', '#3d7bd9', '#d9534f', '#8e6bd6'];
  const blink = Math.floor(f / 15) % 2 === 0;
  return (
    <g transform={`translate(${x},${y + bob}) rotate(${rot}) scale(${scale})`} opacity={opacity}>
      {smoke &&
        Array.from({length: 6}).map((_, i) => {
          const p = (f * 0.6 + i * 18) % 110;
          return <circle key={i} cx={125 - p * 0.9} cy={-190 - p * 1.1} r={12 + p * 0.28} fill="#9aa4b5" opacity={0.45 * (1 - p / 110)} />;
        })}
      <path d="M -225 -40 L 250 -46 L 208 30 L -212 30 Z" fill="#1f2b45" />
      <path d="M -217 4 L 225 4 L 208 30 L -212 30 Z" fill="#b33a3a" />
      <rect x={-222} y={-46} width={466} height={7} fill="#e9edf5" />
      {[0, 1].map((row) =>
        Array.from({length: 6}).map((_, k) => (
          <rect key={`${row}-${k}`} x={-195 + k * 46} y={-86 - row * 40} width={42} height={38} rx={3}
            fill={containers[(k + row * 2) % containers.length]} stroke="rgba(0,0,0,0.25)" strokeWidth={2} />
        )),
      )}
      <rect x={95} y={-160} width={95} height={116} rx={6} fill="#eef2f7" />
      {[0, 1, 2, 3].map((k) => (
        <rect key={k} x={103 + k * 21} y={-148} width={15} height={14} rx={2} fill={lights ? '#ffe9a3' : '#7b8aa3'} />
      ))}
      {[0, 1, 2, 3].map((k) => (
        <rect key={`b${k}`} x={103 + k * 21} y={-118} width={15} height={12} rx={2} fill={lights ? '#ffd677' : '#8d9bb2'} />
      ))}
      <rect x={118} y={-198} width={32} height={40} rx={4} fill="#c0392b" />
      <rect x={118} y={-198} width={32} height={9} fill="#1b1b1b" />
      <line x1={70} y1={-46} x2={70} y2={-215} stroke="#2a344d" strokeWidth={5} />
      <circle cx={70} cy={-218} r={7} fill={lights && blink ? '#ff4d5e' : '#5a2a30'} />
      {lights && <circle cx={70} cy={-218} r={22} fill="rgba(255,77,94,0.25)" opacity={blink ? 1 : 0} />}
    </g>
  );
};
EOF_FILE

cat > src/components/Planes.tsx <<'EOF_FILE'
import React from 'react';
import {useCurrentFrame} from 'remotion';

export const Avenger: React.FC<{x: number; y: number; scale?: number; rot?: number; opacity?: number}> = ({x, y, scale = 1, rot = 0, opacity = 1}) => {
  const f = useCurrentFrame();
  const blade = Math.cos(f * 1.3) * 40;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${scale})`} opacity={opacity}>
      <path d="M -150 -6 L -172 -64 L -130 -60 L -108 -16 Z" fill="#3e5c87" />
      <ellipse cx={-138} cy={4} rx={36} ry={7} fill="#35507a" />
      <path d="M -150 -6 C -100 -24, 60 -32, 122 -20 L 150 -12 L 150 14 L 122 20 C 60 28, -100 16, -150 6 Z" fill="#4a6a96" />
      <path d="M -120 8 C -60 18, 60 22, 122 18 L 122 20 C 60 28, -100 16, -150 6 Z" fill="#b8c7da" />
      <path d="M -40 -24 C -18 -52, 66 -52, 96 -26 Z" fill="#a9d6ff" opacity={0.9} />
      <line x1={0} y1={-46} x2={0} y2={-25} stroke="#3e5c87" strokeWidth={3} />
      <line x1={40} y1={-48} x2={40} y2={-25} stroke="#3e5c87" strokeWidth={3} />
      <ellipse cx={14} cy={10} rx={96} ry={10} fill="#3b5880" />
      <circle cx={-62} cy={0} r={15} fill="#1d2f5a" />
      <path d="M -62 -10 L -59 -3 L -52 -3 L -58 2 L -55 9 L -62 5 L -69 9 L -66 2 L -72 -3 L -65 -3 Z" fill="#fff" />
      <rect x={120} y={-16} width={30} height={32} rx={8} fill="#2f4469" />
      <ellipse cx={156} cy={0} rx={6} ry={42} fill="rgba(210,220,235,0.3)" />
      <line x1={156} y1={-blade} x2={156} y2={blade} stroke="#1c1c1c" strokeWidth={5} strokeLinecap="round" />
    </g>
  );
};

export const Mariner: React.FC<{x: number; y: number; scale?: number; flip?: boolean; opacity?: number}> = ({x, y, scale = 1, flip = false, opacity = 1}) => {
  const f = useCurrentFrame();
  const blade = Math.cos(f * 1.2) * 30;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -scale : scale},${scale})`} opacity={opacity}>
      <path d="M -165 -12 L -190 -74 L -162 -74 L -142 -16 Z" fill="#55657e" />
      <path d="M -170 -10 C -120 -42, 80 -46, 170 -20 C 186 -10, 186 10, 166 20 L -130 22 C -160 15, -176 5, -170 -10 Z" fill="#6d7f99" />
      <path d="M -130 22 L 166 20 C 150 34, 40 40, -60 36 Z" fill="#3d4a5f" />
      <path d="M 110 -30 C 128 -44, 150 -38, 162 -24 Z" fill="#a9d6ff" />
      {[-80, -40, 0, 40].map((wx) => (
        <circle key={wx} cx={wx} cy={-6} r={6} fill="#a9d6ff" opacity={0.8} />
      ))}
      <path d="M -50 -38 L 0 -74 L 120 -66 L 40 -44 Z" fill="#58698a" />
      <ellipse cx={34} cy={-66} rx={42} ry={13} fill="#4a5a78" />
      <ellipse cx={78} cy={-66} rx={5} ry={32} fill="rgba(210,220,235,0.3)" />
      <line x1={78} y1={-66 - blade} x2={78} y2={-66 + blade} stroke="#1c1c1c" strokeWidth={4} />
    </g>
  );
};
EOF_FILE

cat > src/components/Weather.tsx <<'EOF_FILE'
import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {H, W} from '../theme';
import {flashIntensity} from '../lib/anim';

export const Rain: React.FC<{count?: number; opacity?: number}> = ({count = 140, opacity = 0.5}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={W} height={H}>
        {Array.from({length: count}).map((_, i) => {
          const x0 = random(`rx${i}`) * (W + 400) - 100;
          const sp = 38 + random(`rs${i}`) * 22;
          const len = 40 + random(`rl${i}`) * 50;
          const y = ((random(`ry${i}`) * H + f * sp) % (H + 200)) - 100;
          const x = x0 - y * 0.18;
          return (
            <line key={i} x1={x} y1={y} x2={x - len * 0.18} y2={y + len} stroke="#b9d6ff"
              strokeOpacity={opacity * (0.4 + random(`ro${i}`) * 0.6)} strokeWidth={2.2} strokeLinecap="round" />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

export const Fog: React.FC<{opacity: number; top?: number; height?: number; rgb?: string}> = ({opacity, top = 700, height = 700, rgb = '200,215,235'}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
      {[0, 1, 2, 3, 4].map((i) => {
        const w = 1300 + i * 140;
        const x = -260 + Math.sin(f / 80 + i * 1.7) * 160 - i * 40;
        const y = top + (i % 3) * height * 0.25 - 60;
        return (
          <div key={i} style={{
            position: 'absolute', left: x, top: y, width: w, height: height * 0.6,
            background: `radial-gradient(ellipse at center, rgba(${rgb},0.55) 0%, rgba(${rgb},0.25) 40%, rgba(${rgb},0) 70%)`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

const Cloud: React.FC<{x: number; y: number; s: number; color: string}> = ({x, y, s, color}) => (
  <g transform={`translate(${x},${y}) scale(${s})`} fill={color}>
    <circle cx={0} cy={0} r={60} />
    <circle cx={70} cy={-35} r={75} />
    <circle cx={150} cy={-10} r={62} />
    <circle cx={215} cy={10} r={45} />
    <rect x={-55} y={0} width={310} height={55} rx={27} />
  </g>
);

export const CloudLayer: React.FC<{seed: string; count: number; yMin: number; yMax: number; color: string; speed?: number; scale?: number; opacity?: number}> = ({
  seed, count, yMin, yMax, color, speed = 1, scale = 1.5, opacity = 1,
}) => {
  const f = useCurrentFrame();
  const span = W + 1600;
  return (
    <AbsoluteFill style={{opacity}}>
      <svg width={W} height={H}>
        {Array.from({length: count}).map((_, i) => {
          const base = random(`${seed}cx${i}`) * span;
          const x = ((base + f * speed * (0.7 + random(`${seed}cs${i}`) * 0.6)) % span) - 800;
          const y = yMin + random(`${seed}cy${i}`) * (yMax - yMin);
          const s = scale * (0.7 + random(`${seed}cz${i}`) * 0.6);
          return <Cloud key={i} x={x} y={y} s={s} color={color} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

const boltPath = (seed: string, x: number, y0: number, y1: number) => {
  let d = `M ${x} ${y0}`;
  let cx = x;
  const n = 9;
  for (let i = 1; i <= n; i++) {
    cx += (random(`${seed}-${i}`) - 0.5) * 90;
    d += ` L ${cx.toFixed(1)} ${(y0 + ((y1 - y0) * i) / n).toFixed(1)}`;
  }
  return d;
};

export const Lightning: React.FC<{strikes: number[]; y0?: number; y1?: number}> = ({strikes, y0 = 150, y1 = 1000}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={W} height={H}>
        <defs>
          <filter id="boltGlow" x="-50%" y="-10%" width="200%" height="120%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        {strikes.map((s, i) => {
          const v = flashIntensity(f, [s]);
          if (v < 0.05) return null;
          const x = 150 + random(`bx${s}-${i}`) * (W - 300);
          const d = boltPath(`b${s}`, x, y0, y1 * (0.7 + random(`by${s}`) * 0.3));
          return (
            <g key={i} opacity={v}>
              <path d={d} stroke="#9fd8ff" strokeWidth={22} fill="none" filter="url(#boltGlow)" />
              <path d={d} stroke="#ffffff" strokeWidth={5} fill="none" strokeLinejoin="round" />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

export const Flash: React.FC<{strikes: number[]; max?: number}> = ({strikes, max = 0.5}) => {
  const f = useCurrentFrame();
  const v = flashIntensity(f, strikes) * max;
  if (v < 0.01) return null;
  return <AbsoluteFill style={{background: '#dff1ff', opacity: v, mixBlendMode: 'screen', pointerEvents: 'none'}} />;
};

export const Seagulls: React.FC<{count?: number}> = ({count = 4}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        {Array.from({length: count}).map((_, i) => {
          const x = ((random(`g${i}`) * W + f * (2 + i * 0.4)) % (W + 200)) - 100;
          const y = 380 + random(`gy${i}`) * 300 + Math.sin(f / 20 + i) * 15;
          const flap = 0.6 + 0.4 * Math.sin(f * 0.35 + i * 2);
          return (
            <path key={i} d="M -30 0 Q -15 -15 0 0 Q 15 -15 30 0" transform={`translate(${x},${y}) scale(1,${flap})`}
              stroke="#2b3a4f" strokeWidth={5} fill="none" strokeLinecap="round" />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
EOF_FILE

cat > src/components/Radar.tsx <<'EOF_FILE'
import React from 'react';
import {useCurrentFrame} from 'remotion';

export type Blip = {x: number; y: number; alpha: number};

export const Radar: React.FC<{cx: number; cy: number; r: number; blips: Blip[]; speed?: number}> = ({cx, cy, r, blips, speed = 4}) => {
  const f = useCurrentFrame();
  const ang = (f * speed) % 360;
  const a2 = (-40 * Math.PI) / 180;
  return (
    <g transform={`translate(${cx},${cy})`}>
      <defs>
        <radialGradient id="radarBg">
          <stop offset="0%" stopColor="#0a3d24" />
          <stop offset="100%" stopColor="#021208" />
        </radialGradient>
        <filter id="blipGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle r={r + 24} fill="#1b2a24" stroke="#3a4f45" strokeWidth={10} />
      <circle r={r} fill="url(#radarBg)" />
      {[0.25, 0.5, 0.75, 1].map((k) => (
        <circle key={k} r={r * k} fill="none" stroke="#1eff8e" strokeOpacity={0.3} strokeWidth={2} />
      ))}
      <line x1={-r} y1={0} x2={r} y2={0} stroke="#1eff8e" strokeOpacity={0.25} strokeWidth={2} />
      <line x1={0} y1={-r} x2={0} y2={r} stroke="#1eff8e" strokeOpacity={0.25} strokeWidth={2} />
      <g transform={`rotate(${ang})`}>
        <path d={`M 0 0 L ${r} 0 A ${r} ${r} 0 0 0 ${r * Math.cos(a2)} ${r * Math.sin(a2)} Z`} fill="rgba(30,255,142,0.22)" />
        <line x1={0} y1={0} x2={r} y2={0} stroke="#7dffb8" strokeWidth={4} />
      </g>
      {blips.map((b, i) =>
        b.alpha > 0.01 ? (
          <g key={i} opacity={b.alpha}>
            <circle cx={b.x} cy={b.y} r={13} fill="#9dffc9" filter="url(#blipGlow)" />
            <circle cx={b.x} cy={b.y} r={13 + ((f + i * 9) % 30)} fill="none" stroke="#9dffc9" strokeOpacity={1 - ((f + i * 9) % 30) / 30} strokeWidth={3} />
          </g>
        ) : null,
      )}
      <circle r={8} fill="#7dffb8" />
    </g>
  );
};
EOF_FILE

cat > src/components/Compass.tsx <<'EOF_FILE'
import React from 'react';
import {FONT} from '../theme';

export const Compass: React.FC<{cx: number; cy: number; r: number; angle: number}> = ({cx, cy, r, angle}) => (
  <g transform={`translate(${cx},${cy})`}>
    <circle r={r + 30} fill="#7a5a1e" />
    <circle r={r + 18} fill="#c9a24a" />
    <circle r={r} fill="#f5ecd2" />
    {Array.from({length: 72}).map((_, i) => {
      const long = i % 18 === 0 ? 34 : i % 2 === 0 ? 18 : 10;
      return <line key={i} x1={0} y1={-r + 6} x2={0} y2={-r + long} stroke="#5a4520" strokeWidth={i % 18 === 0 ? 5 : 2} transform={`rotate(${i * 5})`} />;
    })}
    {([['উ', 0], ['পূ', 90], ['দ', 180], ['প', 270]] as const).map(([l, a]) => {
      const rad = (a * Math.PI) / 180;
      return (
        <text key={l} x={Math.sin(rad) * (r - 72)} y={-Math.cos(rad) * (r - 72)} fontFamily={FONT} fontWeight={700}
          fontSize={r * 0.2} textAnchor="middle" dominantBaseline="central" fill={a === 0 ? '#d62839' : '#3a3020'}>
          {l}
        </text>
      );
    })}
    <g transform={`rotate(${angle})`}>
      <path d={`M 0 ${-r * 0.78} L ${r * 0.09} 0 L ${-r * 0.09} 0 Z`} fill="#e63946" />
      <path d={`M 0 ${r * 0.78} L ${r * 0.09} 0 L ${-r * 0.09} 0 Z`} fill="#3d4a5c" />
    </g>
    <circle r={r * 0.07} fill="#c9a24a" stroke="#7a5a1e" strokeWidth={4} />
    <path d={`M ${-r * 0.7} ${-r * 0.3} A ${r} ${r} 0 0 1 ${r * 0.3} ${-r * 0.75}`} stroke="rgba(255,255,255,0.5)" strokeWidth={14} fill="none" strokeLinecap="round" />
  </g>
);
EOF_FILE

cat > src/components/Person.tsx <<'EOF_FILE'
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FONT} from '../theme';

export const Person: React.FC<{x: number; y: number; scale?: number; role: 'scientist' | 'navigator'; talking?: boolean; confused?: boolean}> = ({
  x, y, scale = 1, role, talking = false, confused = false,
}) => {
  const f = useCurrentFrame();
  const isSci = role === 'scientist';
  const blink = f % 90 < 4 ? 0.15 : 1;
  const mouth = talking ? 3 + 9 * Math.abs(Math.sin(f * 0.42)) : 3;
  const breathe = Math.sin(f / 16) * 3;
  const sway = Math.sin(f / 22) * 1.5;
  const armSwing = talking ? Math.sin(f * 0.18) * 8 : 0;
  const coat = isSci ? '#f3f6fb' : '#1f3a63';
  const coatShade = isSci ? '#d5dce8' : '#172c4b';
  const pants = isSci ? '#34495e' : '#14243d';
  const skin = '#d9a07a';
  const skinShade = '#c18661';
  const hair = isSci ? '#5b5b66' : '#2a1c14';
  const raise = isSci ? -130 : -55;

  return (
    <g transform={`translate(${x},${y}) scale(${scale}) rotate(${sway})`}>
      <ellipse cx={0} cy={0} rx={110} ry={18} fill="rgba(0,0,0,0.25)" />
      <rect x={-50} y={-170} width={40} height={165} rx={16} fill={pants} />
      <rect x={10} y={-170} width={40} height={165} rx={16} fill={pants} />
      <ellipse cx={-30} cy={-6} rx={34} ry={14} fill="#1a1a1a" />
      <ellipse cx={30} cy={-6} rx={34} ry={14} fill="#1a1a1a" />
      <g transform={`translate(0,${breathe * 0.3})`}>
        <g transform={`rotate(${10 + armSwing * 0.3}, -85, -360)`}>
          <rect x={-118} y={-365} width={40} height={170} rx={20} fill={coatShade} />
          <circle cx={-98} cy={-190} r={22} fill={skin} />
        </g>
        <rect x={-90} y={-380} width={180} height={230} rx={60} fill={coat} />
        {isSci ? (
          <>
            <path d="M -22 -378 L 0 -330 L 22 -378 Z" fill="#7fb3e0" />
            <path d="M -24 -376 L 0 -300 M 24 -376 L 0 -300" stroke={coatShade} strokeWidth={6} />
            <rect x={30} y={-300} width={36} height={40} rx={6} fill={coatShade} />
            <line x1={40} y1={-312} x2={40} y2={-296} stroke="#3d7bd9" strokeWidth={4} />
            <line x1={52} y1={-312} x2={52} y2={-296} stroke="#d9534f" strokeWidth={4} />
          </>
        ) : (
          <>
            <path d="M -30 -380 L 0 -345 L 30 -380 Z" fill="#f3f6fb" />
            {[-340, -300, -260].map((by) => <circle key={by} cx={0} cy={by} r={6} fill="#f2c14e" />)}
            <rect x={-90} y={-372} width={30} height={10} rx={4} fill="#f2c14e" />
            <rect x={60} y={-372} width={30} height={10} rx={4} fill="#f2c14e" />
          </>
        )}
        <g transform={`rotate(${raise + armSwing}, 85, -360)`}>
          <rect x={78} y={-365} width={40} height={150} rx={20} fill={coat} stroke={coatShade} strokeWidth={3} />
          <circle cx={98} cy={-210} r={22} fill={skin} />
          {isSci ? (
            <>
              <rect x={92} y={-205} width={12} height={70} rx={5} fill="#6b4f2a" />
              <circle cx={98} cy={-100} r={38} fill="rgba(180,230,255,0.35)" stroke="#3a3f4a" strokeWidth={8} />
            </>
          ) : (
            <g transform="translate(98,-170)">
              <rect x={-45} y={0} width={90} height={60} rx={8} fill="#e8d3a0" stroke="#b8975a" strokeWidth={4} />
              <path d="M -30 15 L 0 35 L 25 12" stroke="#c0392b" strokeWidth={4} fill="none" strokeDasharray="6 5" />
            </g>
          )}
        </g>
        <rect x={-20} y={-410} width={40} height={40} fill={skinShade} />
        <g transform="translate(0,-470)">
          <circle cx={-76} cy={10} r={16} fill={skinShade} />
          <circle cx={76} cy={10} r={16} fill={skinShade} />
          <circle r={78} fill={skin} />
          {isSci ? (
            <path d="M -78 -10 C -80 -70, -30 -95, 0 -92 C 40 -95, 82 -60, 78 -10 C 60 -45, 30 -55, 0 -50 C -30 -55, -60 -45, -78 -10 Z" fill={hair} />
          ) : (
            <>
              <path d="M -78 -20 C -70 -60, 70 -60, 78 -20 Z" fill={hair} />
              <rect x={-84} y={-92} width={168} height={52} rx={18} fill="#13284a" />
              <rect x={-84} y={-58} width={168} height={12} fill="#f3f6fb" />
              <path d="M -60 -44 Q 20 -20 95 -40 L 95 -46 L -60 -46 Z" fill="#0b1a33" />
              <circle cx={0} cy={-72} r={11} fill="#f2c14e" />
            </>
          )}
          <ellipse cx={-28} cy={0} rx={9} ry={11 * blink} fill="#1b1b1b" />
          <ellipse cx={28} cy={0} rx={9} ry={11 * blink} fill="#1b1b1b" />
          {isSci && (
            <>
              <circle cx={-28} cy={0} r={22} fill="rgba(255,255,255,0.15)" stroke="#2b2b2b" strokeWidth={4} />
              <circle cx={28} cy={0} r={22} fill="rgba(255,255,255,0.15)" stroke="#2b2b2b" strokeWidth={4} />
              <line x1={-6} y1={0} x2={6} y2={0} stroke="#2b2b2b" strokeWidth={4} />
            </>
          )}
          <path d={confused ? 'M -44 -34 L -14 -42' : 'M -44 -28 L -14 -30'} stroke="#2b1d16" strokeWidth={6} strokeLinecap="round" />
          <path d={confused ? 'M 14 -26 L 44 -24' : 'M 14 -30 L 44 -28'} stroke="#2b1d16" strokeWidth={6} strokeLinecap="round" />
          {!isSci && <path d="M -22 26 Q 0 18 22 26 Q 0 34 -22 26 Z" fill="#2a1c14" />}
          <ellipse cx={0} cy={40} rx={16} ry={mouth} fill="#7a2e2e" />
          <circle cx={-48} cy={24} r={11} fill="#e88a7a" opacity={0.4} />
          <circle cx={48} cy={24} r={11} fill="#e88a7a" opacity={0.4} />
        </g>
      </g>
      {confused &&
        [[-130, -650, 0], [120, -620, 1], [0, -720, 2]].map(([qx, qy, k]) => (
          <text key={k} x={qx} y={qy + Math.sin(f / 9 + k * 2) * 12} fontSize={90} fontWeight={700} fontFamily={FONT}
            fill="#ffcf5a" textAnchor="middle" opacity={0.6 + 0.4 * Math.sin(f / 7 + k)}>?</text>
        ))}
    </g>
  );
};
EOF_FILE

cat > src/components/MapView.tsx <<'EOF_FILE'
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS, FONT, W} from '../theme';
import {pointOnPolyline} from '../lib/anim';

const MAP = {lonMin: -87, latMax: 38, latMin: 13, kx: W / 28, ky: (W / 28) * 1.1};
export const MAP_H = Math.round((MAP.latMax - MAP.latMin) * MAP.ky);
export const proj = (lon: number, lat: number): [number, number] => [(lon - MAP.lonMin) * MAP.kx, (MAP.latMax - lat) * MAP.ky];

type LL = [number, number];
const poly = (pts: LL[]) =>
  pts.map(([lo, la], i) => {
    const [x, y] = proj(lo, la);
    return `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ') + ' Z';

const LAND: LL[][] = [
  [[-88, 39], [-74.9, 38.9], [-75.2, 38.0], [-75.8, 36.8], [-75.5, 35.2], [-76.6, 34.7], [-77.9, 33.9], [-79.2, 33.2], [-80.0, 32.6], [-81.0, 31.8], [-81.4, 30.7], [-81.3, 29.6], [-80.6, 28.4], [-80.1, 26.9], [-80.1, 25.9], [-80.4, 25.2], [-81.1, 25.1], [-81.7, 25.9], [-82.1, 26.6], [-82.7, 27.6], [-82.7, 28.6], [-83.6, 29.9], [-84.4, 30.0], [-85.4, 29.7], [-86.5, 30.4], [-88, 30.4]],
  [[-84.9, 21.9], [-84.0, 22.7], [-82.5, 23.1], [-81.0, 23.1], [-79.5, 22.4], [-77.5, 21.6], [-75.6, 21.0], [-74.2, 20.2], [-74.5, 20.0], [-77.0, 19.9], [-77.7, 20.7], [-78.5, 21.5], [-80.5, 22.0], [-81.8, 22.2], [-82.8, 22.6], [-84.4, 21.8]],
  [[-74.4, 19.9], [-72.8, 19.9], [-71.6, 19.8], [-70.0, 19.6], [-69.0, 19.0], [-68.4, 18.6], [-69.0, 18.4], [-70.5, 18.2], [-71.4, 17.6], [-72.0, 18.1], [-73.4, 18.2], [-74.4, 18.4], [-73.0, 18.6], [-72.7, 19.1], [-73.4, 19.6]],
  [[-67.25, 18.5], [-65.6, 18.4], [-65.6, 18.0], [-67.2, 17.95]],
  [[-78.3, 18.4], [-76.8, 18.5], [-76.2, 18.0], [-77.2, 17.7], [-78.3, 18.2]],
];
const ISLANDS: [number, number, number, number, number][] = [
  [-77.8, 24.3, 14, 34, 20], [-77.4, 25.1, 8, 14, 0], [-78.5, 26.6, 34, 8, -10], [-77.1, 26.5, 10, 26, 25],
  [-76.2, 24.9, 6, 30, 30], [-75.8, 23.6, 6, 18, 40], [-73.7, 21.1, 18, 10, 0], [-81.4, 24.7, 22, 4, -15],
];
export const PTS = {bermuda: proj(-64.78, 32.3), miami: proj(-80.19, 25.76), sanjuan: proj(-66.1, 18.47)};
const LANES: LL[][] = [
  [[-80.0, 25.0], [-79.6, 27.5], [-78, 31], [-74, 35], [-68, 38]],
  [[-81.5, 24.3], [-76, 23.6], [-73.5, 20.5], [-72, 18], [-70, 14]],
  [[-79.8, 26.5], [-72, 28.5], [-64, 31], [-59, 33]],
  [[-66, 18.6], [-67, 24], [-70, 30], [-73, 36]],
  [[-87, 24], [-82, 24.3], [-79.9, 25.5], [-79.5, 30], [-76.5, 35.5]],
];

const Pin: React.FC<{x: number; y: number; p: number; label: string; dx: number; dy: number; color: string; anchor?: 'start' | 'end' | 'middle'}> = ({
  x, y, p, label, dx, dy, color, anchor = 'middle',
}) => {
  const f = useCurrentFrame();
  if (p <= 0) return null;
  const q = Math.min(p, 1);
  const ring = (f % 40) / 40;
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r={10 + ring * 44} fill="none" stroke={color} strokeOpacity={(1 - ring) * 0.8 * q} strokeWidth={4} />
      <g transform={`translate(0,${(1 - q) * -120}) scale(${p})`}>
        <path d="M 0 0 C -6 -14, -26 -30, -26 -52 A 26 26 0 1 1 26 -52 C 26 -30, 6 -14, 0 0 Z" fill={color} stroke="#fff" strokeWidth={4} />
        <circle cx={0} cy={-52} r={10} fill="#fff" />
      </g>
      <text x={dx} y={dy} opacity={q} fontFamily={FONT} fontWeight={700} fontSize={40} fill="#fff" stroke="rgba(0,0,0,0.8)"
        strokeWidth={9} paintOrder="stroke" textAnchor={anchor}>{label}</text>
    </g>
  );
};

export const MapView: React.FC<{pins?: number[]; tri?: number; triFill?: number; triOpacity?: number; lanes?: number; labels?: number; bright?: number; oceanLabel?: number}> = ({
  pins = [0, 0, 0], tri = 0, triFill = 0, triOpacity = 1, lanes = 0, labels = 1, bright = 0, oceanLabel = 0,
}) => {
  const f = useCurrentFrame();
  const {bermuda: B, miami: M, sanjuan: S} = PTS;
  const triD = `M ${M[0]} ${M[1]} L ${B[0]} ${B[1]} L ${S[0]} ${S[1]} Z`;
  const perim = Math.hypot(B[0] - M[0], B[1] - M[1]) + Math.hypot(S[0] - B[0], S[1] - B[1]) + Math.hypot(M[0] - S[0], M[1] - S[1]);
  const pulse = 0.5 + 0.5 * Math.sin(f / 6);
  const label = (lon: number, lat: number, text: string, size = 30) => {
    const [x, y] = proj(lon, lat);
    return <text x={x} y={y} opacity={labels} fontFamily={FONT} fontWeight={600} fontSize={size} fill="#3a3020" textAnchor="middle">{text}</text>;
  };
  const [ox, oy] = proj(-69, 36);
  return (
    <svg width={W} height={MAP_H} viewBox={`0 0 ${W} ${MAP_H}`}>
      <defs>
        <linearGradient id="mapSea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c2f57" />
          <stop offset="100%" stopColor="#082040" />
        </linearGradient>
        <filter id="mapGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="9" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width={W} height={MAP_H} fill="url(#mapSea)" />
      <rect width={W} height={MAP_H} fill="#3d9ad6" opacity={bright * 0.55} />
      {[-85, -80, -75, -70, -65, -60].map((lo) => {
        const [x] = proj(lo, 0);
        return <line key={lo} x1={x} y1={0} x2={x} y2={MAP_H} stroke="rgba(255,255,255,0.08)" strokeWidth={2} />;
      })}
      {[15, 20, 25, 30, 35].map((la) => {
        const [, y] = proj(0, la);
        return <line key={la} x1={0} y1={y} x2={W} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth={2} />;
      })}
      {LAND.map((p, i) => <path key={`s${i}`} d={poly(p)} fill="rgba(0,0,0,0.3)" transform="translate(6,8)" />)}
      {LAND.map((p, i) => <path key={i} d={poly(p)} fill={COLORS.land} stroke={COLORS.landEdge} strokeWidth={2.5} strokeLinejoin="round" />)}
      {ISLANDS.map(([lo, la, rx, ry, rot], i) => {
        const [x, y] = proj(lo, la);
        return <ellipse key={i} cx={x} cy={y} rx={rx * 0.6} ry={ry * 0.6} fill={COLORS.land} transform={`rotate(${rot} ${x} ${y})`} />;
      })}
      {label(-79.2, 21.0, 'কিউবা', 28)}
      {label(-75.3, 25.9, 'বাহামা', 26)}
      <text x={ox} y={oy} opacity={oceanLabel} fontFamily={FONT} fontWeight={600} fontSize={40} fill="rgba(180,225,255,0.85)" textAnchor="middle">আটলান্টিক মহাসাগর</text>
      {lanes > 0 &&
        LANES.map((lane, i) => {
          const pts = lane.map(([lo, la]) => proj(lo, la));
          const d = pts.map(([x, y], k) => `${k ? 'L' : 'M'} ${x} ${y}`).join(' ');
          return (
            <g key={i} opacity={lanes}>
              <path d={d} stroke="rgba(255,255,255,0.35)" strokeWidth={3} fill="none" strokeDasharray="10 12" />
              {[0, 1, 2, 3].map((k) => {
                const [x, y] = pointOnPolyline(pts, (f * 0.004 * (1 + i * 0.15) + k / 4) % 1);
                return <circle key={k} cx={x} cy={y} r={8} fill="#fff" stroke="#38e8ff" strokeWidth={3} />;
              })}
            </g>
          );
        })}
      <g opacity={triOpacity}>
        <path d={triD} fill={`rgba(56,232,255,${0.2 * triFill})`} stroke="none" />
        <path d={triD} fill="none" stroke={COLORS.glow} strokeWidth={14} strokeOpacity={0.35 * pulse * triFill} strokeLinejoin="round" />
        <path d={triD} fill="none" stroke={COLORS.glow} strokeWidth={6} strokeLinejoin="round" strokeDasharray={perim} strokeDashoffset={perim * (1 - tri)} filter="url(#mapGlow)" />
      </g>
      <Pin x={B[0]} y={B[1]} p={pins[0]} label="বারমুডা" dx={0} dy={-100} color="#ff4d5e" />
      <Pin x={M[0]} y={M[1]} p={pins[1]} label="ফ্লোরিডা" dx={-34} dy={-70} color="#ffb020" anchor="end" />
      <Pin x={S[0]} y={S[1]} p={pins[2]} label="পুয়ের্তো রিকো" dx={0} dy={60} color="#9b5cff" />
    </svg>
  );
};
EOF_FILE

cat > src/components/Overlays.tsx <<'EOF_FILE'
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
EOF_FILE

cat > src/components/Icons.tsx <<'EOF_FILE'
import React from 'react';

export type IconKind = 'storm' | 'wave' | 'current' | 'compass' | 'human';

export const Icon: React.FC<{kind: IconKind; size?: number; color?: string}> = ({kind, size = 44, color = '#fff'}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    {kind === 'storm' && (
      <>
        <path d="M14 30 a9 9 0 0 1 1 -18 a12 12 0 0 1 22 3 a8 8 0 0 1 -1 15 Z" fill={color} />
        <path d="M24 28 l-5 10 h6 l-3 9 l9 -13 h-6 l3 -6 Z" fill="#ffd166" />
      </>
    )}
    {kind === 'wave' && (
      <>
        <path d="M4 20 q6 -8 12 0 t12 0 t12 0 t12 0" stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M4 32 q6 -8 12 0 t12 0 t12 0 t12 0" stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7} />
      </>
    )}
    {kind === 'current' && (
      <>
        <path d="M6 36 C 16 10, 30 40, 42 14" stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M33 13 L42 14 L41 23" stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>
    )}
    {kind === 'compass' && (
      <>
        <circle cx={24} cy={24} r={18} stroke={color} strokeWidth={4} fill="none" />
        <path d="M24 10 L28 24 L20 24 Z" fill="#ff4d5e" />
        <path d="M24 38 L28 24 L20 24 Z" fill={color} />
      </>
    )}
    {kind === 'human' && (
      <>
        <circle cx={24} cy={15} r={8} fill={color} />
        <path d="M10 42 c0 -14 28 -14 28 0 Z" fill={color} />
        <text x={38} y={14} fontSize={16} fontWeight={700} fill="#ffd166">?</text>
      </>
    )}
  </svg>
);
EOF_FILE

cat > src/components/Subtitles.tsx <<'EOF_FILE'
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
EOF_FILE

cat > src/components/SoundDesign.tsx <<'EOF_FILE'
import React from 'react';
import {Audio, Sequence, interpolate, staticFile} from 'remotion';
import {CLAMP} from '../lib/anim';
import {SFX, narrationFile} from '../data/script';
import {cueStart, radarPings, strikesFor} from '../data/fx';
import type {Timeline} from '../timeline';

const bed = (dur: number, v: number) => (f: number) => v * interpolate(f, [0, 15, dur - 15, dur], [0, 1, 1, 0], CLAMP);

export const SoundDesign: React.FC<{timeline: Timeline; assets: Record<string, boolean>}> = ({timeline, assets}) => {
  const has = (p: string) => !!assets[p];
  const S = timeline.scenes;
  const narr = S.map((s) => [s.from + s.narrationStart, s.from + s.narrationStart + s.narrationFrames] as const);

  const musicVolume = (f: number) => {
    let duck = 0;
    for (const [a, b] of narr) duck = Math.max(duck, interpolate(f, [a - 10, a, b, b + 15], [0, 1, 1, 0], CLAMP));
    const fadeIn = interpolate(f, [0, 30], [0, 1], CLAMP);
    const fadeOut = interpolate(f, [timeline.total - 60, timeline.total], [1, 0], CLAMP);
    return (0.32 - duck * 0.19) * fadeIn * fadeOut;
  };

  const oceanVol = [0.5, 0, 0.3, 0.55, 0.35, 0.4];
  const windVol = [0.35, 0, 0, 0.4, 0, 0.25];

  return (
    <>
      {has(SFX.music) && <Audio src={staticFile(SFX.music)} loop volume={musicVolume} />}
      {S.map((s, i) =>
        has(narrationFile(i)) ? (
          <Sequence key={`n${i}`} from={s.from + s.narrationStart} name={`Narration ${i + 1}`}>
            <Audio src={staticFile(narrationFile(i))} />
          </Sequence>
        ) : null,
      )}
      {has(SFX.ocean) &&
        S.map((s, i) =>
          oceanVol[i] > 0 ? (
            <Sequence key={`o${i}`} from={s.from} durationInFrames={s.duration} name={`Ocean ${i + 1}`}>
              <Audio src={staticFile(SFX.ocean)} loop volume={bed(s.duration, oceanVol[i])} />
            </Sequence>
          ) : null,
        )}
      {has(SFX.wind) &&
        S.map((s, i) =>
          windVol[i] > 0 ? (
            <Sequence key={`w${i}`} from={s.from} durationInFrames={s.duration} name={`Wind ${i + 1}`}>
              <Audio src={staticFile(SFX.wind)} loop volume={bed(s.duration, windVol[i])} />
            </Sequence>
          ) : null,
        )}
      {has(SFX.thunder) &&
        S.flatMap((s) =>
          strikesFor(s).map((st, k) => (
            <Sequence key={`t${s.index}-${k}`} from={s.from + st + 5} durationInFrames={150} name="Thunder">
              <Audio src={staticFile(SFX.thunder)} volume={s.index === 5 ? 0.35 : 0.75} />
            </Sequence>
          )),
        )}
      {has(SFX.radar) &&
        S.flatMap((s) =>
          radarPings(s).map((p, k) => (
            <Sequence key={`r${k}`} from={s.from + p} durationInFrames={45} name="Radar ping">
              <Audio src={staticFile(SFX.radar)} volume={0.55} />
            </Sequence>
          )),
        )}
      {has(SFX.whoosh) &&
        S.slice(1).map((s) => (
          <Sequence key={`wh${s.index}`} from={Math.max(0, s.from - 10)} durationInFrames={40} name="Whoosh">
            <Audio src={staticFile(SFX.whoosh)} volume={0.5} />
          </Sequence>
        ))}
      {has(SFX.riser) && S[2] && (
        <Sequence from={Math.max(0, S[2].from + cueStart(S[2], 3) - 110)} durationInFrames={125} name="Riser (radar)">
          <Audio src={staticFile(SFX.riser)} volume={0.45} />
        </Sequence>
      )}
      {has(SFX.riser) && S[5] && (
        <Sequence from={Math.max(0, S[5].from + cueStart(S[5], 2) - 110)} durationInFrames={125} name="Riser (ending)">
          <Audio src={staticFile(SFX.riser)} volume={0.4} />
        </Sequence>
      )}
    </>
  );
};
EOF_FILE

cat > src/scenes/Scene1.tsx <<'EOF_FILE'
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
EOF_FILE

cat > src/scenes/Scene2.tsx <<'EOF_FILE'
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {SceneShell, Vignette} from '../components/SceneShell';
import {MAP_H, MapView, PTS} from '../components/MapView';
import {Badge} from '../components/Overlays';
import {CLAMP, ramp} from '../lib/anim';
import {cueEnd, cueStart} from '../data/fx';
import {FONT, H, W} from '../theme';
import type {SceneTiming} from '../timeline';

const MAP_TOP = 330;

const Globe: React.FC<{f: number}> = ({f}) => {
  const r = 300;
  const rot = f * 0.04;
  const pulse = 0.5 + 0.5 * Math.sin(f / 5);
  return (
    <g>
      <defs>
        <radialGradient id="globeG" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#3fa9f5" />
          <stop offset="100%" stopColor="#0a2a5c" />
        </radialGradient>
        <clipPath id="globeClip"><circle r={r} /></clipPath>
      </defs>
      <circle r={r + 22} fill="rgba(80,190,255,0.15)" />
      <circle r={r} fill="url(#globeG)" />
      <g clipPath="url(#globeClip)">
        <path d="M -230 -190 C -140 -240, -40 -210, -30 -140 C -20 -90, -90 -70, -110 -20 C -130 20, -170 -40, -240 -80 Z" fill="#d9c79a" />
        <path d="M -60 20 C 0 10, 30 60, 10 120 C -10 180, -50 230, -60 280 C -80 200, -110 100, -60 20 Z" fill="#d9c79a" />
        <path d="M 150 -200 C 210 -210, 260 -150, 250 -80 C 230 -20, 190 40, 200 120 C 150 60, 130 -40, 150 -200 Z" fill="#d9c79a" />
        {Array.from({length: 6}).map((_, k) => (
          <ellipse key={k} rx={r * Math.abs(Math.cos(rot + (k * Math.PI) / 6))} ry={r} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={2} />
        ))}
        {[-60, -30, 0, 30, 60].map((la) => {
          const y = -r * Math.sin((la * Math.PI) / 180);
          const w = r * Math.cos((la * Math.PI) / 180);
          return <ellipse key={la} cy={y} rx={w} ry={w * 0.1} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={2} />;
        })}
      </g>
      <circle cx={-10} cy={-70} r={16 + pulse * 18} fill="rgba(56,232,255,0.3)" />
      <circle cx={-10} cy={-70} r={12} fill="#38e8ff" />
      <text x={-10} y={-120} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill="#fff" stroke="rgba(0,0,0,0.7)" strokeWidth={8} paintOrder="stroke">
        উত্তর আটলান্টিক
      </text>
    </g>
  );
};

export const Scene2: React.FC<{t: SceneTiming}> = ({t}) => {
  const f = useCurrentFrame();
  const d = t.duration;
  const back = Easing.out(Easing.back(1.6));
  const globeScale = interpolate(f, [0, 30, 58], [0.7, 1, 2.8], CLAMP);
  const globeOp = 1 - ramp(f, 36, 58);
  const mapIn = ramp(f, 34, 60);
  const p2s = cueStart(t, 2);
  const p2e = cueEnd(t, 2);
  const pins = [p2s, p2s + (p2e - p2s) * 0.35, p2s + (p2e - p2s) * 0.7].map((s) => ramp(f, s, s + 14, 0, 1, back));
  const triStart = cueStart(t, 3);
  const triEnd = cueStart(t, 4) + 12;
  const tri = ramp(f, triStart, triEnd);
  const triFill = ramp(f, triEnd - 6, triEnd + 20);
  const {bermuda: B, miami: M, sanjuan: S} = PTS;
  const cx = (B[0] + M[0] + S[0]) / 3;
  const cy = (B[1] + M[1] + S[1]) / 3 + MAP_TOP;
  const zoom = ramp(f, triStart, d, 0, 1);
  const camScale = interpolate(f, [40, d], [1.0, 1.12], CLAMP) + zoom * 0.04;
  const camX = (W / 2 - cx) * zoom * 0.9;
  const camY = (H / 2 - cy) * zoom * 0.9;

  return (
    <SceneShell t={t} scale={camScale} x={camX} y={camY} overlay={
      <>
        <Badge kicker="অবস্থান" text="উত্তর আটলান্টিক মহাসাগর" appearAt={45} top={150} tone="info" until={triEnd + 4} />
        <Badge kicker="জেনে রাখুন" text="এই ত্রিভুজের কোনো সরকারি সীমানা নেই" appearAt={triEnd + 12} top={150} tone="info" size={38} />
      </>
    }>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #0e3566 0%, #04122a 75%)'}} />
      <AbsoluteFill style={{opacity: mapIn, transform: `scale(${0.85 + 0.15 * mapIn})`}}>
        <div style={{position: 'absolute', top: MAP_TOP, left: 0, width: W, height: MAP_H}}>
          <MapView pins={pins} tri={tri} triFill={triFill} oceanLabel={ramp(f, cueStart(t, 0), cueStart(t, 0) + 15)} />
        </div>
      </AbsoluteFill>
      {globeOp > 0 && (
        <AbsoluteFill style={{opacity: globeOp}}>
          <svg width={W} height={H}>
            <g transform={`translate(${W / 2},${880}) scale(${globeScale})`}>
              <Globe f={f} />
            </g>
          </svg>
        </AbsoluteFill>
      )}
      <Vignette strength={0.55} />
    </SceneShell>
  );
};
EOF_FILE

cat > src/scenes/Scene3.tsx <<'EOF_FILE'
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
EOF_FILE

cat > src/scenes/Scene4.tsx <<'EOF_FILE'
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneShell, Vignette} from '../components/SceneShell';
import {Sky} from '../components/Sky';
import {CloudLayer, Flash, Lightning, Rain} from '../components/Weather';
import {Ocean} from '../components/Ocean';
import {Ship} from '../components/Ship';
import {Person} from '../components/Person';
import {Compass} from '../components/Compass';
import {Badge} from '../components/Overlays';
import {Icon, IconKind} from '../components/Icons';
import {CLAMP, mono, ramp, windowed} from '../lib/anim';
import {cueStart, strikesFor} from '../data/fx';
import {COLORS, FONT, H, W} from '../theme';
import type {SceneTiming} from '../timeline';

const CHIPS: {kind: IconKind; label: string}[] = [
  {kind: 'storm', label: 'ঝড়'},
  {kind: 'wave', label: 'ঢেউ'},
  {kind: 'current', label: 'স্রোত'},
  {kind: 'compass', label: 'নেভিগেশন'},
  {kind: 'human', label: 'মানুষের ভুল'},
];

const Chip: React.FC<{kind: IconKind; label: string; lit: number; big?: boolean}> = ({kind, label, lit, big}) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: big ? 20 : 12, padding: big ? '18px 36px' : '10px 22px', borderRadius: 999,
    background: lit > 0.5 ? 'rgba(56,232,255,0.22)' : 'rgba(10,20,40,0.65)',
    border: `3px solid ${lit > 0.5 ? COLORS.glow : 'rgba(255,255,255,0.18)'}`,
    boxShadow: lit > 0.5 ? '0 0 24px rgba(56,232,255,0.5)' : 'none',
    transform: `scale(${0.92 + 0.08 * lit})`, opacity: 0.45 + 0.55 * lit,
    fontFamily: FONT, fontWeight: 700, fontSize: big ? 52 : 34, color: '#fff', lineHeight: 1.4,
  }}>
    <Icon kind={kind} size={big ? 64 : 40} />
    {label}
  </div>
);

export const Scene4: React.FC<{t: SceneTiming}> = ({t}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const d = t.duration;
  const s = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => cueStart(t, i));
  const strikes = strikesFor(t);

  const introOp = 1 - ramp(f, s[2] - 8, s[2] + 6);
  const seaOp = ramp(f, s[2] - 8, s[2] + 6);
  const rough = interpolate(f, mono([s[2], s[3], s[3] + 20, s[4] + 10, d]), [1.3, 1.6, 2.7, 1.5, 1.3], CLAMP);
  const rainOp = windowed(f, s[2], s[4] + 10, 8, 20);
  const curOp = windowed(f, s[4] - 4, s[5] + 6);
  const compOp = windowed(f, s[5] - 4, s[6] + 6);
  const humOp = windowed(f, s[6] - 4, s[7] + 6);
  const finOp = ramp(f, s[7] - 4, s[7] + 8);
  const dim = Math.max(compOp, humOp, finOp) * 0.62;
  const stamp = spring({frame: f - (s[1] + 18), fps, config: {damping: 10, stiffness: 160}});
  const compPop = spring({frame: f - s[5], fps, config: {damping: 12}});
  const needle = 25 * Math.sin(f * 0.23) + 40 * Math.sin(f * 0.061);

  const currents = [
    'M -100 1500 C 200 1300, 500 1450, 800 1200 S 1100 1000, 1250 900',
    'M -100 1650 C 250 1450, 550 1600, 850 1350 S 1150 1150, 1250 1050',
    'M -100 1350 C 150 1180, 450 1300, 750 1060 S 1050 880, 1250 760',
  ];

  return (
    <SceneShell t={t} overlay={
      <>
        {f >= s[2] - 5 && finOp < 1 && (
          <AbsoluteFill style={{pointerEvents: 'none', opacity: 1 - finOp}}>
            <div style={{position: 'absolute', top: 170, left: 40, right: 40, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16}}>
              {CHIPS.map((c, i) => <Chip key={c.kind} {...c} lit={ramp(f, s[2 + i], s[2 + i] + 8)} />)}
            </div>
          </AbsoluteFill>
        )}
        <Badge kicker="ব্যাখ্যা" text="উপসাগরীয় স্রোত (গাল্ফ স্ট্রিম) ধ্বংসাবশেষ দ্রুত দূরে সরিয়ে নিতে পারে" appearAt={s[4]} top={370} tone="info" size={36} opacity={curOp} />
        <Badge kicker="ব্যাখ্যা" text="চুম্বকীয় কম্পাসের বিচ্যুতি ও দিক নির্ণয়ের ভুল" appearAt={s[5]} top={370} tone="info" size={38} opacity={compOp} />
        <Badge kicker="রেকর্ড অনুযায়ী" text="ফ্লাইট ১৯-এর দলনেতা ভেবেছিলেন তাঁরা ফ্লোরিডা কিজের ওপর আছেন — সম্ভবত ছিলেন বাহামার কাছে" appearAt={s[6]} top={370} tone="record" size={34} opacity={humOp} />
        <Flash strikes={strikes} max={0.45} />
      </>
    }>
      {introOp > 0 && (
        <AbsoluteFill style={{opacity: introOp}}>
          <AbsoluteFill style={{background: 'linear-gradient(180deg, #0b2238 0%, #123b5a 100%)'}} />
          <AbsoluteFill style={{opacity: 0.25, background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0 2px, transparent 2px 80px), repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0 2px, transparent 2px 80px)'}} />
          <div style={{position: 'absolute', top: 360, left: 440, width: 560, padding: '40px 36px', borderRadius: 32, background: 'rgba(5,15,35,0.85)',
            border: '3px solid rgba(255,159,67,0.6)', fontFamily: FONT, color: '#fff', textAlign: 'center',
            transform: `translateY(${(1 - ramp(f, s[0], s[0] + 15)) * 40}px)`, opacity: ramp(f, s[0], s[0] + 15)}}>
            <div style={{fontSize: 30, color: COLORS.legend, fontWeight: 600}}>● জনপ্রিয় গল্প</div>
            <div style={{fontSize: 64, fontWeight: 700, lineHeight: 1.4, marginTop: 10}}>অতিপ্রাকৃত শক্তি?</div>
            {f >= s[1] + 18 && (
              <div style={{marginTop: 26, display: 'inline-block', padding: '10px 30px', border: `6px solid ${COLORS.danger}`, borderRadius: 16, color: COLORS.danger,
                fontSize: 60, fontWeight: 700, transform: `rotate(-10deg) scale(${2 - Math.min(1, stamp)})`, opacity: Math.min(1, stamp)}}>
                প্রমাণ নেই
              </div>
            )}
          </div>
          <AbsoluteFill>
            <svg width={W} height={H}>
              <Person x={270} y={1420} scale={1.05} role="scientist" talking={f >= s[0] && f < s[2]} />
            </svg>
          </AbsoluteFill>
          <Vignette strength={0.5} />
        </AbsoluteFill>
      )}
      {seaOp > 0 && (
        <AbsoluteFill style={{opacity: seaOp}}>
          <Sky stops={['#0a0f1f', '#1b2440 50%', '#2a3555 62%']} />
          <Lightning strikes={strikes} y0={120} y1={950} />
          <CloudLayer seed="s4a" count={7} yMin={100} yMax={700} color="#161d33" speed={1.8} scale={2.2} />
          <Ocean horizonY={1080} colors={['#1d3350', '#172b47', '#12233c', '#0d1b30', '#091425']} roughness={rough} speed={1.4} split={2}>
            <Ship x={560} y={1125} scale={0.9} rock={rough} lights />
          </Ocean>
          <AbsoluteFill style={{opacity: rainOp}}><Rain count={150} opacity={0.5} /></AbsoluteFill>
          {curOp > 0 && (
            <AbsoluteFill style={{opacity: curOp}}>
              <svg width={W} height={H}>
                <defs>
                  <filter id="curGlow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="6" /></filter>
                </defs>
                {currents.map((p, i) => (
                  <g key={i}>
                    <path d={p} stroke={COLORS.glow} strokeWidth={22} fill="none" opacity={0.35} filter="url(#curGlow)" />
                    <path d={p} stroke="#c9fbff" strokeWidth={9} fill="none" strokeDasharray="60 40" strokeDashoffset={-f * 7 - i * 30} strokeLinecap="round" />
                  </g>
                ))}
              </svg>
            </AbsoluteFill>
          )}
          <AbsoluteFill style={{background: '#030814', opacity: dim}} />
          {compOp > 0 && (
            <AbsoluteFill style={{opacity: compOp}}>
              <svg width={W} height={H}>
                <g transform={`translate(540,930) scale(${0.6 + 0.4 * Math.min(1, compPop)}) translate(-540,-930)`}>
                  <Compass cx={540} cy={930} r={270} angle={needle} />
                </g>
              </svg>
            </AbsoluteFill>
          )}
          {humOp > 0 && (
            <AbsoluteFill style={{opacity: humOp}}>
              <svg width={W} height={H}>
                <Person x={540} y={1400} scale={1.05} role="navigator" confused talking />
              </svg>
            </AbsoluteFill>
          )}
          {finOp > 0 && (
            <AbsoluteFill style={{opacity: finOp, justifyContent: 'center', alignItems: 'center', gap: 22, paddingBottom: 380, display: 'flex', flexDirection: 'column'}}>
              <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 56, color: COLORS.gold, marginBottom: 10, textShadow: '0 4px 20px rgba(0,0,0,0.8)'}}>সম্ভাব্য বৈজ্ঞানিক ব্যাখ্যা</div>
              {CHIPS.map((c, i) => (
                <div key={c.kind} style={{transform: `translateX(${(1 - ramp(f, s[7] + i * 4, s[7] + i * 4 + 12, 0, 1, Easing.out(Easing.cubic))) * (i % 2 ? 300 : -300)}px)`}}>
                  <Chip {...c} lit={1} big />
                </div>
              ))}
            </AbsoluteFill>
          )}
          <Vignette />
        </AbsoluteFill>
      )}
    </SceneShell>
  );
};
EOF_FILE

cat > src/scenes/Scene5.tsx <<'EOF_FILE'
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
EOF_FILE

cat > src/scenes/Scene6.tsx <<'EOF_FILE'
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
EOF_FILE

cat > scripts/generate-sfx.sh <<'EOF_FILE'
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
command -v ffmpeg >/dev/null || { echo "❌ FFmpeg missing: brew install ffmpeg"; exit 1; }
SFX=public/audio/sfx
mkdir -p "$SFX" public/audio/narration
ENC=(-ar 44100 -ac 2 -c:a libmp3lame -q:a 3)
mk() {
  local out="$1"; shift
  if [[ -f "$out" && "${FORCE:-0}" != "1" ]]; then echo "↷ exists, skipped: $out"; return; fi
  ffmpeg -hide_banner -loglevel error -y "$@" "${ENC[@]}" "$out"
  echo "✓ $out"
}
mk "$SFX/ocean.mp3" -f lavfi -i "anoisesrc=color=brown:amplitude=0.5:duration=24:sample_rate=44100" \
  -af "highpass=f=40,lowpass=f=650,tremolo=f=0.14:d=0.8,volume=2.2,afade=t=in:d=1.5"
mk "$SFX/wind.mp3" -f lavfi -i "anoisesrc=color=pink:amplitude=0.4:duration=24:sample_rate=44100" \
  -af "bandpass=f=420:width_type=h:w=380,tremolo=f=0.21:d=0.75,volume=2.6,afade=t=in:d=1.5"
mk "$SFX/thunder.mp3" -f lavfi -i "anoisesrc=color=brown:amplitude=1:duration=5:sample_rate=44100" \
  -af "lowpass=f=220,afade=t=in:d=0.03,afade=t=out:st=0.35:d=4.6,aecho=0.8:0.6:300|700:0.5|0.3,volume=3.5"
mk "$SFX/radar.mp3" -f lavfi -i "sine=frequency=1150:duration=1.6:sample_rate=44100" \
  -af "afade=t=in:d=0.005,afade=t=out:st=0.01:d=1.5,aecho=0.8:0.6:220:0.35,volume=0.5"
mk "$SFX/whoosh.mp3" -f lavfi -i "anoisesrc=color=white:amplitude=0.6:duration=1.2:sample_rate=44100" \
  -af "bandpass=f=1100:width_type=h:w=1500,afade=t=in:d=0.6:curve=exp,afade=t=out:st=0.6:d=0.6:curve=exp,volume=1.3"
mk "$SFX/riser.mp3" -f lavfi -i "aevalsrc='0.25*sin(2*PI*(110*t+70*t*t))':s=44100:d=4" \
  -af "afade=t=in:d=3.6:curve=exp,afade=t=out:st=3.8:d=0.2,aecho=0.8:0.7:120:0.4"
MUSIC_EXPR="0.14*sin(2*PI*55*t)*(0.7+0.3*sin(2*PI*0.07*t))+0.09*sin(2*PI*65.41*t)*(0.5+0.5*sin(2*PI*0.05*t))+0.07*sin(2*PI*82.41*t)*(0.5+0.5*sin(2*PI*0.031*t))+0.05*sin(2*PI*110*t)*(0.5+0.5*sin(2*PI*0.09*t))+0.03*sin(2*PI*164.81*t)*(0.5+0.5*sin(2*PI*0.013*t))+0.16*sin(2*PI*48*t)*exp(-6*(t-2*floor(t/2)))"
mk public/audio/music.mp3 -f lavfi -i "aevalsrc='${MUSIC_EXPR}':s=44100:d=100" \
  -af "lowpass=f=1600,aecho=0.8:0.85:400|800:0.35|0.25,afade=t=in:d=4,afade=t=out:st=93:d=7,volume=1.4"
echo "🎵 All sounds created → public/audio/"
EOF_FILE

cat > scripts/generate-voice.sh <<'EOF_FILE'
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
VOICE="${VOICE:-bn-BD-PradeepNeural}"
RATE="${RATE:--6%}"
PITCH="${PITCH:--4Hz}"
command -v edge-tts >/dev/null || { echo "❌ edge-tts missing: brew install pipx && pipx install edge-tts && pipx ensurepath"; exit 1; }
command -v ffmpeg >/dev/null || { echo "❌ FFmpeg missing: brew install ffmpeg"; exit 1; }
npm run --silent export-text
mkdir -p public/audio/narration .tmp
for i in 1 2 3 4 5 6; do
  echo "🎙️  Scene $i …"
  edge-tts --voice "$VOICE" --rate="$RATE" --pitch="$PITCH" --file "narration/tts/scene$i.txt" --write-media ".tmp/scene$i.raw.mp3"
  ffmpeg -hide_banner -loglevel error -y -i ".tmp/scene$i.raw.mp3" \
    -af "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,highpass=f=70,bass=g=3:f=120,loudnorm=I=-16:TP=-1.5:LRA=11" \
    -ar 44100 -ac 2 -c:a libmp3lame -q:a 2 "public/audio/narration/scene$i.mp3"
done
rm -rf .tmp
npm run --silent srt
echo "✅ Narration ready → public/audio/narration/ · subtitles.srt updated"
EOF_FILE

cat > scripts/export-narration.ts <<'EOF_FILE'
import fs from 'node:fs';
import path from 'node:path';
import {SCENES} from '../src/data/script';
import {buildTimeline} from '../src/timeline';

const tl = buildTimeline([]);
const sec = (fr: number) => (fr / tl.fps).toFixed(1);
fs.mkdirSync('narration/tts', {recursive: true});
SCENES.forEach((s, i) => fs.writeFileSync(path.join('narration/tts', `scene${i + 1}.txt`), s.tts + '\n', 'utf8'));
const body = SCENES.map((s, i) => {
  const t = tl.scenes[i];
  return `## দৃশ্য ${i + 1} (${s.id}) · আনুমানিক ${sec(t.from)}–${sec(t.from + t.duration)} সেকেন্ড\n\n${s.chunks.join(' ')}\n\n[TTS টেক্সট]\n${s.tts}\n`;
}).join('\n');
const header = `বারমুডা ট্রায়াঙ্গেল: সমুদ্রের সেই রহস্যময় জায়গা!
বাংলা ভয়েসওভার স্ক্রিপ্ট — পুরুষ ডকুমেন্টারি কণ্ঠ, গভীর ও উষ্ণ, রহস্যময় কিন্তু স্বাভাবিক।
নির্দেশনা: প্রতিটি "।", "!", "?"-এর পর স্বাভাবিক বিরতি; "..." মানে একটু দীর্ঘ নাটকীয় বিরতি।
নিজে রেকর্ড করলে: প্রতিটি দৃশ্য আলাদা ফাইলে public/audio/narration/sceneN.mp3 নামে রাখুন।

`;
fs.writeFileSync('narration.txt', header + body, 'utf8');
console.log('✓ narration.txt + narration/tts/scene1-6.txt written');
EOF_FILE

cat > scripts/make-srt.ts <<'EOF_FILE'
import {execSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {SCENES, narrationFile} from '../src/data/script';
import {buildTimeline} from '../src/timeline';

const duration = (rel: string): number | null => {
  const full = path.join('public', rel);
  if (!fs.existsSync(full)) return null;
  try {
    const v = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${full}"`).toString().trim());
    return Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
};

const durs = SCENES.map((_, i) => duration(narrationFile(i)));
const tl = buildTimeline(durs);
const ts = (frame: number) => {
  const ms = Math.round((frame / tl.fps) * 1000);
  const p = (n: number, l = 2) => String(n).padStart(l, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor((ms % 3600000) / 60000))}:${p(Math.floor((ms % 60000) / 1000))},${p(ms % 1000, 3)}`;
};
const srt = tl.cues.map((c, i) => `${i + 1}\n${ts(c.start)} --> ${ts(c.end)}\n${c.text}\n`).join('\n');
fs.writeFileSync('subtitles.srt', srt, 'utf8');
fs.mkdirSync('out', {recursive: true});
fs.writeFileSync('out/subtitles.srt', srt, 'utf8');
const missing = durs.filter((d) => d === null).length;
console.log(`✓ subtitles.srt (${tl.cues.length} cues, total ${(tl.total / tl.fps).toFixed(1)}s)` + (missing ? ` — ${missing} narration file(s) missing, estimated timing used` : ' — exact audio timing'));
EOF_FILE

cat > scripts/render.sh <<'EOF_FILE'
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p out
npm run --silent srt || true
npx remotion render src/index.ts BermudaTriangle out/bermuda-raw.mp4 \
  --codec=h264 --crf=18 --pixel-format=yuv420p \
  --audio-codec=aac --audio-bitrate=192k \
  --image-format=jpeg --jpeg-quality=92
ffmpeg -hide_banner -loglevel error -y -i out/bermuda-raw.mp4 \
  -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 192k -ar 48000 \
  -movflags +faststart out/bermuda-triangle-final.mp4
echo "✅ Done → out/bermuda-triangle-final.mp4"
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate -show_entries format=duration \
  -of default=noprint_wrappers=1 out/bermuda-triangle-final.mp4
EOF_FILE

cat > README.md <<'EOF_FILE'
# বারমুডা ট্রায়াঙ্গেল — 2D Animated Bengali Short (Remotion)
1080x1920 · 30 fps · ~85 s

Requirements (Mac):
    brew install node ffmpeg pipx
    pipx install edge-tts && pipx ensurepath

Run:
    npm install
    npm run sfx       # music + sound effects (FFmpeg)
    npm run voice     # Bengali narration + exact subtitles.srt
    npm run dev       # preview at http://localhost:3000
    npm run render    # out/bermuda-triangle-final.mp4

Replace any file in public/audio/ with a better one of the same name
(e.g. Pixabay music/SFX or your own recorded voice); the scripts never overwrite existing files.
Edit text in src/data/script.ts, then re-run `npm run voice`.
EOF_FILE

chmod +x scripts/*.sh
npx --yes tsx scripts/export-narration.ts >/dev/null 2>&1 || true

echo ""
echo "📦 Installing dependencies (1–3 minutes)…"
npm install
npx tsx scripts/export-narration.ts
npx tsx scripts/make-srt.ts
echo ""
echo "✅ Project ready! Next:"
echo "   npm run sfx"
echo "   npm run voice"
echo "   npm run dev      (preview)"
echo "   npm run render   (final MP4)"