import React from 'react';
import {CalculateMetadataFunction, Composition, staticFile} from 'remotion';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {JamVideo, VideoProps} from './Video';
import {ALL_ASSETS, FPS, HEIGHT, LINES_FILE, SCENES, WIDTH, narrationFile, type LinesFile} from './data/script';
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
  let lines: LinesFile['scenes'] = [];
  if (assets[LINES_FILE]) {
    try {
      lines = ((await (await fetch(staticFile(LINES_FILE))).json()) as LinesFile).scenes ?? [];
    } catch {
      lines = [];
    }
  }
  const timeline = buildTimeline(durations, lines);
  return {durationInFrames: timeline.total, props: {timeline, assets}};
};

const fallback = buildTimeline([]);

export const RemotionRoot: React.FC = () => (
  <Composition
    id="DhakaJam"
    component={JamVideo}
    durationInFrames={fallback.total}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={{timeline: fallback, assets: {}}}
    calculateMetadata={calculateMetadata}
  />
);
