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
