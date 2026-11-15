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
