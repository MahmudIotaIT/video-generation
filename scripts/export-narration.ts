import fs from 'node:fs';
import {SCENES, SPEAKERS, VIDEO_TITLE} from '../src/data/script';
import {buildTimeline} from '../src/timeline';

const tl = buildTimeline([]);
const sec = (fr: number) => (fr / tl.fps).toFixed(1);
const body = SCENES.map((s, i) => {
  const t = tl.scenes[i];
  const lines = s.lines.map((l) => `${SPEAKERS[l.who].name}: ${l.tts ?? l.text}`).join('\n');
  return `## দৃশ্য ${i + 1} (${s.id}) · আনুমানিক ${sec(t.from)}–${sec(t.from + t.duration)} সেকেন্ড\n\n${lines}\n`;
}).join('\n');
const header = `${VIDEO_TITLE}
মজার কার্টুন সংলাপ — দুই চরিত্র: ${SPEAKERS.rumana.name} (তাড়াহুড়োয়, শহুরে বাংলা) আর ${SPEAKERS.karim.name} (ঠান্ডা মাথা, ঢাকাইয়া টান)।
নিজে রেকর্ড করলে: প্রতিটি দৃশ্য আলাদা ফাইলে public/audio/narration/sceneN.mp3 নামে রাখুন, তারপর lines.json মুছে npm run srt চালান।

`;
fs.writeFileSync('narration.txt', header + body, 'utf8');
console.log('✓ narration.txt written');
