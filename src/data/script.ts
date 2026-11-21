export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const LEAD_IN = 0.5;
export const TAIL = 1.0;

export const VIDEO_TITLE = 'ঢাকার জ্যামে রিকশা: মিটিং কি ধরা যাবে?';

export type Speaker = 'rumana' | 'karim';

export const SPEAKERS: Record<Speaker, {name: string; color: string; voice: string; rate: string; pitch: string}> = {
  rumana: {name: 'রুমানা আপা', color: '#ff7eb6', voice: 'bn-BD-NabanitaNeural', rate: '+4%', pitch: '+0Hz'},
  karim: {name: 'করিম মামা', color: '#7ee0a1', voice: 'bn-BD-PradeepNeural', rate: '-8%', pitch: '-6Hz'},
};

/** One dialogue line = one subtitle cue = one TTS clip. `tts` overrides what the voice says; `pause` = extra comic beat (s) before it. */
export type Line = {who: Speaker; text: string; tts?: string; pause?: number};

/** leadIn: seconds before the first line (room for SFX such as the phone ring). */
export type SceneScript = {id: string; minSeconds: number; leadIn?: number; lines: Line[]};

export const SCENES: SceneScript[] = [
  {
    id: '1-Morning',
    minSeconds: 10,
    lines: [
      {who: 'rumana', text: 'মামা, মতিঝিল যাবেন?'},
      {who: 'rumana', text: 'নয়টায় আমার মিটিং!'},
      {who: 'karim', text: 'যামু আপা...'},
      {who: 'karim', text: 'কিন্তু কবে পৌঁছামু, সেইটা আল্লাহ জানে!', pause: 0.3},
    ],
  },
  {
    id: '2-Jam',
    minSeconds: 12,
    lines: [
      {who: 'rumana', text: 'মামা, একটু জোরে চালান না!'},
      {who: 'karim', text: 'আপা, সামনে বাস, পিছনে বাস,'},
      {who: 'karim', text: 'ডাইনে প্রাইভেট কার...'},
      {who: 'karim', text: 'আমি কি উড়াল দিমু?', pause: 0.45},
    ],
  },
  {
    id: '3-Jhalmuri',
    minSeconds: 12,
    leadIn: 1.2,
    lines: [
      {who: 'karim', text: 'আপা, ঝালমুড়ি খাইবেন?'},
      {who: 'karim', text: 'জ্যাম তো আর ছাড়ব না।'},
      {who: 'rumana', text: 'আমি মিটিংয়ে যাচ্ছি,'},
      {who: 'rumana', text: 'পিকনিকে না!', pause: 0.15},
    ],
  },
  {
    id: '4-Snail',
    minSeconds: 12,
    leadIn: 0.8,
    lines: [
      {who: 'karim', text: 'ওই দেখেন আপা!'},
      {who: 'karim', text: 'শামুকটাও আমাগো ওভারটেক কইরা গেল!'},
      {who: 'rumana', text: 'তাহলে শামুকটারেই জিগান,'},
      {who: 'rumana', text: 'মতিঝিল যাইব কিনা!'},
    ],
  },
  {
    id: '5-Phone',
    minSeconds: 12,
    leadIn: 1.8,
    lines: [
      {who: 'rumana', text: 'জি স্যার, আমি রাস্তায়...'},
      {who: 'rumana', text: 'জি, ভিডিও কলেই মিটিং করি!'},
      {who: 'karim', text: 'আপা, পিছনে আমারেও দেখাইয়েন,'},
      {who: 'karim', text: 'একটু ফেমাস হই!'},
    ],
  },
  {
    id: '6-Closed',
    minSeconds: 15,
    leadIn: 1.0,
    lines: [
      {who: 'karim', text: 'আপা, পৌঁছাইয়া গেছি!'},
      {who: 'rumana', text: 'মামা... অফিস তো ছুটি হয়ে গেছে!', pause: 0.5},
      {who: 'karim', text: 'তাইলে চলেন, বাসায় ফিরি...'},
      {who: 'karim', text: 'কাল সকালে পৌঁছামু!', pause: 0.35},
      {who: 'rumana', text: 'আপনার মতামত কমেন্টে জানান!', pause: 0.7},
    ],
  },
];

export const narrationFile = (i: number) => `audio/narration/scene${i + 1}.mp3`;
/** Written by scripts/generate-dialogue.ts: exact start/end (seconds) of every line inside each scene file. */
export const LINES_FILE = 'audio/narration/lines.json';
export type LinesFile = {scenes: ({start: number; end: number}[] | null)[]};

export const SFX = {
  music: 'audio/jam/music.mp3',
  traffic: 'audio/jam/traffic.mp3',
  busHorn: 'audio/jam/horn-bus.mp3',
  carHorn: 'audio/jam/horn-car.mp3',
  bell: 'audio/jam/bell.mp3',
  boing: 'audio/jam/boing.mp3',
  pop: 'audio/jam/pop.mp3',
  slide: 'audio/jam/slide.mp3',
  phone: 'audio/jam/phone.mp3',
  trombone: 'audio/jam/trombone.mp3',
  ticks: 'audio/jam/ticks.mp3',
  whoosh: 'audio/sfx/whoosh.mp3',
} as const;

export const ALL_ASSETS: string[] = [...Object.values(SFX), LINES_FILE, ...SCENES.map((_, i) => narrationFile(i))];
